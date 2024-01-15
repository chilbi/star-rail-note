import { Fragment } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import BlackSheet from './BlackSheet';
import { STATE } from '../common/state';
import { formatParam, formatSkill } from '../data/local';

interface ExtraSkillsProps {
  skillTrees: CharacterSkillTree[];
}

export default function ExtraSkills({ skillTrees }: ExtraSkillsProps) {
  return (
    <BlackSheet sx={{ px: 3, py: 1.5 }}>
      {skillTrees.map(skillTree => (
        <ExtraSkill key={skillTree.id} skillTree={skillTree} />
      ))}
    </BlackSheet>
  );
}

interface ExtraSkillProps {
  skillTree: CharacterSkillTree;
}

function ExtraSkill({ skillTree }: ExtraSkillProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pr: 1.5
          }}
        >
          <img src={STATE.resUrl + skillTree.icon} alt="" width={36} height={36} />
          <Typography
            level="title-sm"
            textColor="common.black"
            sx={{
              mt: 0.5,
              px: 1,
              borderRadius: '1em',
              backgroundColor: '#ffffff'
            }}
            children="额外能力"
          />
        </Box>
        <Typography component="p" level="title-lg">{skillTree.name}</Typography>
      </Box>
      {skillTree.desc !== '' &&
        <Typography component="p" level="body-md" pt={1}>
          {formatSkill(skillTree, 1).map((descChunk, index) => (
            <Fragment key={index}>
              {descChunk.param === null ? (
                descChunk.text
              ) : descChunk.param === '\n' ? (
                <br />
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <Typography color="warning">{formatParam(descChunk.param as any)}</Typography>
              )}
            </Fragment>
          ))}
        </Typography>
      }
    </>
  );
}
