import { Suspense, useCallback } from 'react';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import FlexItem from '../component/FlexItem';
import CharacterProfile from '../component/CharacterProfile';
import CharacterSkills from '../component/CharacterSkills';
import ExtraSkills from '../component/ExtraSkills';
import PropertyAdditionSkills from '../component/PropertyAdditionSkills';
import CharacterRanks from '../component/CharacterRanks';
import { CharacterDetailData } from './loaders';
import { getCategorizedSkillTrees, getCategorizedSkills } from '../data/local';
import { STATE } from '../common/state';
import Loading from '../component/Loding';

// const skillTypes: SkillType[] = ['Normal', 'BPSkill', 'Ultra', 'Talent', 'Maze'];

export default function CharacterDetail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useLoaderData() as any;
  const navigate = useNavigate();
  const handleBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={data.characterDetailData}
        children={({ character }: CharacterDetailData) => {
          const categorizedSkills = getCategorizedSkills(character.skills, STATE.starRailData.character_skills);
          const categorizedSkillTrees = getCategorizedSkillTrees(character.skill_trees, STATE.starRailData.character_skill_tress);
          return (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  p: { md: 1 }
                }}
              >
                <FlexItem>
                  <CharacterProfile character={character} />
                </FlexItem>
                <FlexItem>
                  <PropertyAdditionSkills skillTrees={categorizedSkillTrees['PropertyAddition']} />
                  <ExtraSkills skillTrees={categorizedSkillTrees['ExtraCapacity']} />
                  <CharacterSkills skills={categorizedSkills['Talent']} />
                </FlexItem>
                <FlexItem>
                  <CharacterSkills skills={categorizedSkills['MazeNormal']} />
                  <CharacterSkills skills={categorizedSkills['Maze']} />
                  <CharacterSkills skills={categorizedSkills['Normal']} />
                </FlexItem>
                <FlexItem>
                  <CharacterSkills skills={categorizedSkills['BPSkill']} />
                  <CharacterSkills skills={categorizedSkills['Ultra']} />
                </FlexItem>
                <FlexItem>
                  <CharacterRanks character={character} />
                </FlexItem>
              </Box>

              <IconButton
                variant="solid"
                color="primary"
                onClick={handleBack}
                sx={{
                  position: 'absolute',
                  right: 32,
                  bottom: 32,
                  zIndex: 999
                }}
              >
                <ArrowBackIosNewRoundedIcon />
              </IconButton>
            </>
          );
        }}
      />
    </Suspense>
  );
}
