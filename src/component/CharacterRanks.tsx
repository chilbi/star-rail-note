import { Fragment } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import BlackSheet from './BlackSheet';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';

interface CharacterRanksProps {
  character: Character;
}

export default function CharacterRanks({ character }: CharacterRanksProps) {
  return (
    <BlackSheet>
      {character.ranks.map(rank => (
        <CharacterRank key={rank} rank={STATE.starRailData.character_ranks[rank]} />
      ))}
    </BlackSheet>
  );
}

interface CharacterRankProps {
  rank: CharacterRank;
}

function CharacterRank({ rank }: CharacterRankProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        px: 3,
        py: 0.5
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pr: 1.5,
          pt: 1
        }}
      >
        <img src={STATE.resUrl + rank.icon} alt="" width={36} height={36} />
        <Typography
          level="title-sm"
          textColor="common.black"
          sx={{
            mt: 0.5,
            px: 1,
            borderRadius: '1em',
            backgroundColor: '#ffffff'
          }}
        >
          {'星魂' + rank.rank}
        </Typography>
      </Box>
      <div>
        <Typography level="title-lg" pt={1}>{rank.name}</Typography>
        <Typography component="p" level="body-sm" textColor={imageTheme.rankColor} lineHeight="2em">
          {rank.desc.split('\\n').map((text, i, arr) => (
            <Fragment key={i}>
              {text}
              {i !== arr.length - 1 && <br />}
            </Fragment>
          ))}
        </Typography>
      </div>
    </Box>
  );
}
