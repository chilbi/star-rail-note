function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function promisifyTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = transaction.onerror = () => reject(transaction.error);
  });
}

function eachCursor(
  store: IDBObjectStore,
  callback: (cursor: IDBCursorWithValue) => void
): Promise<void> {
  store.openCursor().onsuccess = function () {
    if (!this.result) return;
    callback(this.result);
    this.result.continue();
  };
  return promisifyTransaction(store.transaction);
}

export default class Database<Key extends IDBValidKey, Value> {
  dbName: string;
  storeName: string;
  dbPromise: Promise<IDBDatabase>;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName);
    }
    this.dbPromise = promisifyRequest(request);
  }

  useStore<U>(
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => U | PromiseLike<U>
  ): Promise<U> {
    return this.dbPromise.then(db =>
      callback(db.transaction(this.storeName, mode).objectStore(this.storeName))
    );
  }

  count(): Promise<number> {
    return this.useStore('readonly', store => promisifyRequest(store.count()));
  }

  get(key: Key): Promise<Value | undefined> {
    return this.useStore('readonly', store => promisifyRequest(store.get(key)));
  }

  getMany(keys: Key[]): Promise<Value[]> {
    return this.useStore('readonly', store =>
      Promise.all(keys.map(key => promisifyRequest(store.get(key)))),
    );
  }

  set(key: Key, value: Value): Promise<void> {
    return this.useStore('readwrite', store => {
      store.put(value, key);
      return promisifyTransaction(store.transaction);
    });
  }

  setMany(entries: [Key, Value][]): Promise<void> {
    return this.useStore('readwrite', store => {
      entries.forEach(entry => store.put(entry[1], entry[0]));
      return promisifyTransaction(store.transaction);
    });
  }

  update(key: Key, updater: (oldValue: Value | undefined) => Value): Promise<void> {
    return this.useStore('readwrite', store => {
      return new Promise((resolve, reject) => {
        store.get(key).onsuccess = function () {
          try {
            store.put(updater(this.result), key);
            resolve(promisifyTransaction(store.transaction));
          } catch (err) {
            reject(err);
          }
        };
      })
    });
  }

  del(key: Key): Promise<void> {
    return this.useStore('readwrite', store => {
      store.delete(key);
      return promisifyTransaction(store.transaction);
    });
  }

  delMany(keys: Key[]): Promise<void> {
    return this.useStore('readwrite', store => {
      keys.forEach(key => store.delete(key));
      return promisifyTransaction(store.transaction);
    });
  }

  clear(): Promise<void> {
    return this.useStore('readwrite', store => {
      store.clear();
      return promisifyTransaction(store.transaction);
    });
  }

  eachStoreCursor(callback: (cursor: IDBCursorWithValue) => void): Promise<void> {
    return this.useStore('readonly', store => {
      return eachCursor(store, callback);
    });
  }

  keys(): Promise<Key[]> {
    return this.useStore('readonly', store => {
      if (store.getAllKeys) {
        return promisifyRequest(store.getAllKeys() as unknown as IDBRequest<Key[]>);
      }
      const items: Key[] = [];
      return eachCursor(store, cursor =>
        items.push(cursor.key as Key)
      ).then(() => items);
    });
  }

  values(): Promise<Value[]> {
    return this.useStore('readonly', store => {
      if (store.getAll) {
        return promisifyRequest(store.getAll() as IDBRequest<Value[]>);
      }
      const items: Value[] = [];
      return eachCursor(store, cursor =>
        items.push(cursor.value as Value)
      ).then(() => items);
    });
  }

  entries(): Promise<[Key, Value][]> {
    return this.useStore('readonly', store => {
      if (store.getAll && store.getAllKeys) {
        return Promise.all([
          promisifyRequest(store.getAllKeys() as unknown as IDBRequest<Key[]>),
          promisifyRequest(store.getAll() as IDBRequest<Value[]>)
        ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]));
      }
      const items: [Key, Value][] = [];
      return eachCursor(store, cursor =>
        items.push([cursor.key as Key, cursor.value]),
      ).then(() => items);
    });
  }
}
