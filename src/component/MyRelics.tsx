import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import BlackSheet from './BlackSheet';
import PropertyItem from './PropertyItem';
import { STATE } from '../common/state';
import { relicTypeMap, setMap } from '../data/local';
import { imageTheme } from '../common/theme';

function subAffixCount(count: number): string {
  return count > 1 ? ' ' + '+'.repeat(count - 1) : '';
}

interface MyRelicsProps {
  relics: RelicInfo[];
  relicSets: RelicSetInfo[];
}

export default function MyRelics({ relics, relicSets }: MyRelicsProps) {
  const setIds: string[] = [];
  // relics.forEach(r => { if (r.type === "HAND") console.log(r) })

  return (
    <BlackSheet>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          py: 1
        }}
      >
        {relics.map(relic => (
          <Box
            key={relic.id}
            sx={{
              flexGrow: 1,
              p: 1,
              width: { xs: '100%', sm: '50%' }
            }}
          >
            <Box display="flex" gap={1} mb={1}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  p: '3px',
                  borderRadius: '50%',
                  backgroundImage: imageTheme.getItemRarityImageColor(relic.rarity)
                }}
              >
                <img src={STATE.resUrl + relic.icon} alt="" width="100%" height="100%" />
              </Box>
              <Box flexGrow={1}>
                <Typography level="title-sm">{relic.name}</Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography level="body-sm">{relicTypeMap[relic.type]}</Typography>
                  <Typography level="title-sm" color="warning">+{relic.level}</Typography>
                </Box>
              </Box>
            </Box>

            <div>
              <PropertyItem
                icon={STATE.resUrl + relic.main_affix.icon}
                name={relic.main_affix.name}
                value={relic.main_affix.display}
                sx={{ backgroundColor: imageTheme.previewRarityColors[relic.rarity] + '66' }}
              />
              {relic.sub_affix.map((affix, i) => (
                <PropertyItem
                  key={i}
                  icon={STATE.resUrl + affix.icon}
                  name={<>{affix.name}<Typography level="body-xs" color="warning">{subAffixCount(affix.count)}</Typography></>}
                  value={affix.display}
                  sx={{ backgroundColor: i % 2 === 0 ? '#ffffff11' : '#ffffff33' }}
                />
              ))}
            </div>
          </Box>
        ))}
      </Box>

      {relicSets.length > 0 && (
        <div>
          {relicSets.map((relicSet, i) => {
            const notExistingSet = setIds.indexOf(relicSet.id) < 0;
            setIds.push(relicSet.id);
            return (
              <Box key={i} p={1}>
                {notExistingSet && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <img src={STATE.resUrl + relicSet.icon} width={36} height={36} />
                    <Typography level="title-lg" ml={1}>{relicSet.name}</Typography>
                  </Box>
                )}
                <Typography level="body-md" textColor="#18ffcd" pl={2} pr={1}>{setMap[relicSet.num] + relicSet.desc}</Typography>
              </Box>
            );
          })}
        </div>
      )}
    </BlackSheet>
  );
}
