/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useLayoutEffect } from 'react';
import { GetScrollRestorationKeyFunction, UNSAFE_DataRouterContext, UNSAFE_DataRouterStateContext, UNSAFE_NavigationContext, useLocation, useMatches, useNavigation } from 'react-router-dom';

const SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
let savedScrollPositions: Record<string, number> = {};

export function useElementScrollRestoration(
  elementRef: React.MutableRefObject<HTMLElement | undefined>,
  getKey?: GetScrollRestorationKeyFunction,
  storageKey?: string
) {
  let { router } = useContext(UNSAFE_DataRouterContext)!;
  let { restoreScrollPosition, preventScrollReset } = useContext(UNSAFE_DataRouterStateContext)!;
  let { basename } = useContext(UNSAFE_NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  let navigation = useNavigation();

  // Trigger manual scroll restoration while we're active
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = 'auto';
    };
  }, []);

  // Save positions on pagehide
  usePageHide(
    useCallback(() => {
      if (navigation.state === 'idle') {
        let key = (getKey ? getKey(location, matches) : null) || location.key;
        savedScrollPositions[key] = elementRef.current?.scrollTop ?? 0;//window.scrollY;
      }
      try {
        sessionStorage.setItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY,
          JSON.stringify(savedScrollPositions)
        );
      } catch (error) {
        console.warn(
          `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${error}).`
        );
      }
      window.history.scrollRestoration = 'auto';
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey, getKey, navigation.state, location, matches])
  );

  // Read in any saved scroll locations
  if (typeof document !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      try {
        let sessionPositions = sessionStorage.getItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY
        );
        if (sessionPositions) {
          savedScrollPositions = JSON.parse(sessionPositions);
        }
      } catch (e) {
        // no-op, use default empty object
      }
    }, [storageKey]);

    // Enable scroll restoration in the router
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      let getKeyWithoutBasename: GetScrollRestorationKeyFunction | undefined =
        getKey && basename !== "/"
          ? (location, matches) =>
            getKey(
              // Strip the basename to match useLocation()
              {
                ...location,
                pathname:
                  stripBasename(location.pathname, basename) ||
                  location.pathname,
              },
              matches
            )
          : getKey;
      let disableScrollRestoration = router?.enableScrollRestoration(
        savedScrollPositions,
        () => elementRef.current?.scrollTop ?? 0,//window.scrollY,
        getKeyWithoutBasename
      );
      return () => disableScrollRestoration && disableScrollRestoration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, basename, getKey]);

    // Restore scrolling when state.restoreScrollPosition changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      // Explicit false means don't do anything (used for submissions)
      if (restoreScrollPosition === false) {
        return;
      }

      // been here before, scroll to it
      if (typeof restoreScrollPosition === 'number') {
        elementRef.current?.scrollTo(0, restoreScrollPosition);
        //window.scrollTo(0, restoreScrollPosition);
        return;
      }

      // try to scroll to the hash
      if (location.hash) {
        let el = document.getElementById(
          decodeURIComponent(location.hash.slice(1))
        );
        if (el) {
          el.scrollIntoView();
          return;
        }
      }

      // Don't reset if this navigation opted out
      if (preventScrollReset === true) {
        return;
      }

      // otherwise go to the top on new locations
      elementRef.current?.scrollTo(0, 0);
      //window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, restoreScrollPosition, preventScrollReset]);
  }
}

/**
 * Setup a callback to be fired on the window's `pagehide` event. This is
 * useful for saving some data to `window.localStorage` just before the page
 * refreshes.  This event is better supported than beforeunload across browsers.
 *
 * Note: The `callback` argument should be a function created with
 * `React.useCallback()`.
 */
function usePageHide(
  callback: (event: PageTransitionEvent) => any,
  options?: { capture?: boolean }
): void {
  let { capture } = options || {};
  useEffect(() => {
    let opts = capture != null ? { capture } : undefined;
    window.addEventListener('pagehide', callback, opts);
    return () => {
      window.removeEventListener('pagehide', callback, opts);
    };
  }, [callback, capture]);
}

function stripBasename(
  pathname: string,
  basename: string
): string | null {
  if (basename === "/") return pathname;

  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }

  // We want to leave trailing slash behavior in the user's control, so if they
  // specify a basename with a trailing slash, we should support it
  let startIndex = basename.endsWith("/")
    ? basename.length - 1
    : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }

  return pathname.slice(startIndex) || "/";
}
