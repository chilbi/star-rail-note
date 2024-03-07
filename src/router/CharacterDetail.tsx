import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import Box from '@mui/joy/Box';

import Loading from '../component/Loding';
import BackButton from '../component/BackButton';
import FlexItem from '../component/FlexItem';
import CharacterProfile from '../component/CharacterProfile';
import CharacterSkills from '../component/CharacterSkills';
import ExtraSkills from '../component/ExtraSkills';
import PropertyAdditionSkills from '../component/PropertyAdditionSkills';
import CharacterRanks from '../component/CharacterRanks';
import { CharacterDetailData } from './loaders';
import { getCategorizedSkillTrees, getCategorizedSkills } from '../data/local';
import { STATE } from '../common/state';

// const skillTypes: SkillType[] = ['Normal', 'BPSkill', 'Ultra', 'Talent', 'Maze'];

export default function CharacterDetail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useLoaderData() as any;

  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={data.characterDetailData}
        children={({ character }: CharacterDetailData) => {
          const categorizedSkills = getCategorizedSkills(character.skills, STATE.starRailData.character_skills);
          const categorizedSkillTrees = getCategorizedSkillTrees(character.skill_trees, STATE.starRailData.character_skill_trees);
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

              <BackButton />
            </>
          );
        }}
      />
    </Suspense>
  );
}
