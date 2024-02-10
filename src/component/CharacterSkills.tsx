import { Fragment, useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Slider from '@mui/joy/Slider';

import BlackSheet from './BlackSheet';
import { STATE } from '../common/state';
import { formatParam, formatSkill, skillDefaultMaxLevelMap } from '../data/local';

interface CharacterSkillsProps {
  skills: CharacterSkill[];
}

export default function CharacterSkills({ skills }: CharacterSkillsProps) {
  const defaultLevel = Math.min(
    skills[0]?.max_level ?? 1,
    skillDefaultMaxLevelMap[skills[0]?.type]
  );
  const [level, setLevel] = useState(defaultLevel);
  
  const handleLevelChange = useCallback((_: Event, value: number) => {
    setLevel(value);
  }, []);

  return (
    <BlackSheet sx={{ py: 1.5 }}>
      {skills.map((skill, index) => (
        <CharacterSkill
          key={skill.id}
          isFirst={index === 0}
          skill={skill}
          level={level}
          onLevelChange={handleLevelChange}
        />
      ))}
    </BlackSheet>
  );
}

interface CharacterSkillProps {
  isFirst: boolean;
  skill: CharacterSkill;
  level: number;
  onLevelChange: (e: Event, value: number) => void;
}

function CharacterSkill({ isFirst, skill, level, onLevelChange }: CharacterSkillProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          px: 3
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pr: 1.5
            // opacity: isFirst ? 1 : 0
          }}
        >
          <img src={STATE.resUrl + skill.icon} alt="" width={36} height={36} />
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
            {skill.type_text.startsWith('dev_') ? skill.type_text.slice('dev_'.length) : skill.type_text}
          </Typography>
        </Box>
        <Box flexGrow={1}>
          <Typography component="p" level="title-lg" my={1}>{skill.name}</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {skill.effect_text !== '' &&
              <Typography level="body-sm" textColor="warning.300">[{skill.effect_text}]</Typography>
            }
            {isFirst &&
              <Typography level="body-sm" textColor="text.secondary" ml="auto">
                {'等级 ' + (skill.max_level > 1 ? `${level}/${skill.max_level}` : skill.max_level)}
              </Typography>
            }
          </Box>
        </Box>
      </Box>
      {isFirst && skill.max_level > 1 &&
        <Box px={3} pt={1}>
          <Slider
            min={1}
            max={skill.max_level}
            marks={[{ value: skillDefaultMaxLevelMap[skill.type] }]}
            size="sm"
            // color="neutral"
            value={level}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={onLevelChange as any}
            sx={{ py: 1 }}
          />
        </Box>
      }
      {skill.desc !== '' &&
        <Typography component="p" level="body-sm" textColor="text.primary" px={3} pt={1}>
          {formatSkill(skill, level).map((descChunk, index) => (
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
