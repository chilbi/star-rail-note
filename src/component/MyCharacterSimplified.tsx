import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import AspectRatio from '@mui/joy/AspectRatio';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';

import BlackSheet from './BlackSheet';
import MyCharacterProperties from './MyCharacterProperties';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import ElementsPaths from './ElementsPaths';
import Rarity from './Rarity';
import { nickname } from '../data/local';
import Tooltip from '@mui/joy/Tooltip';

interface MyCharacterSimplifiedProps {
  character: CharacterInfo;
  onToggle: () => void;
}

export default function MyCharacterSimplified({ character, onToggle }: MyCharacterSimplifiedProps) {
  const [activeTab, setActiveTab] = useState<'element' | 'path' | null>(null);
  const navigate = useNavigate();

  const handleOpenElement = useCallback(() => setActiveTab('element'), []);
  const handleOpenPath = useCallback(() => setActiveTab('path'), []);
  const handleClose = useCallback(() => setActiveTab(null), []);

  const handleCharacterNameClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    navigate('/character/' + character.id);
  }, [character.id, navigate]);

  const handleLightConeNameClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    navigate('/light-cone/' + character.light_cone!.id);
  }, [character.light_cone, navigate]);

  // const categorizedSkillTrees = getCategorizedSkillTrees(
  //   STATE.starRailData.characters[character.id].skill_trees,
  //   STATE.starRailData.character_skill_trees
  // );

  return (
    <Box position="relative">
      <Button
        size="sm"
        variant="soft"
        onClick={onToggle}
        startDecorator={<SyncAltRoundedIcon />}
        children="详细"
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: '8px',
          right: '8px',
        }}
      />
      <BlackSheet sx={{ mt: '46px' }}>
        <Box
          sx={{
            display: 'flex',
            borderTopRightRadius: '24px',
            backgroundImage: `linear-gradient(${imageTheme.previewRarityColors[character.rarity]}72, #00000000 35%)`
          }}
        >
          <Box
            sx={{
              flexGrow: 0,
              flexShrink: 1,
              position: 'relative',
              width: { xs: 150, md: 187 }
              // py: 3,
              // borderTopRightRadius: '16px',
              // backgroundImage: imageTheme.getItemRarityImageColor(character.rarity),
              // overflow: 'hidden',
              // transform: 'translateY(-10px)',
            }}
          >
            <AspectRatio ratio="374/512" variant="plain">
              <img src={STATE.resUrl + character.preview} alt="" />
            </AspectRatio>
            <Box
              onClick={handleOpenElement}
              sx={{
                position: 'absolute',
                zIndex: 3,
                top: '8px',
                left: '8px',
                cursor: 'pointer'
              }}
            >
              <img src={STATE.resUrl + character.element.icon} alt="" width={30} height={30} />
            </Box>
            <Box
              onClick={handleOpenPath}
              sx={{
                position: 'absolute',
                zIndex: 3,
                top: '48px',
                left: '8px',
                cursor: 'pointer'
              }}
            >
              <img src={STATE.resUrl + character.path?.icon} alt="" width={30} height={30} />
            </Box>
            <ElementsPaths
              activeTab={activeTab}
              element={character.element.id}
              path={character.path?.id ?? ''}
              onClose={handleClose}
            />
          </Box>

          <Box flexGrow={1} flexShrink={0}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="查看角色图鉴" color="primary" arrow>
                  <Typography
                    level="h4"
                    onClick={handleCharacterNameClick}
                    children={nickname(character.name)}
                    sx={{ cursor: 'pointer' }}
                  />
                </Tooltip>
                <Rarity rarity={character.rarity} height={14} />
              </Box>
              <div>
                <Typography
                  level="body-xs"
                  textColor="common.black"
                  children={'Lv.' + character.level}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    px: 0.5,
                    borderRadius: '4px',
                    backgroundColor: '#ffffff'
                  }}
                />
                <Typography
                  level="body-xs"
                  textColor="common.black"
                  children={character.rank + '星魂'}
                  sx={{
                    mx: 1,
                    px: 0.5,
                    borderRadius: '4px',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </Box>

            <Divider sx={{ '--Divider-childPosition': '24px', my: 0.5 }}>光锥</Divider>
            {character.light_cone ? (
              <Tooltip title="查看光锥图鉴" color="primary" arrow>
                <Box
                  onClick={handleLightConeNameClick}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    cursor: 'pointer'
                  }}
                >
                  <img src={STATE.resUrl + character.light_cone.icon} alt="" width={42} height={42} />
                  <div>
                    <Typography
                      level="title-md"
                      children={character.light_cone.name}
                      textColor={imageTheme.previewRarityColors[character.light_cone.rarity]}
                    />
                    <Typography
                      level="body-xs"
                      children={`等级${character.light_cone.level} 叠影${character.light_cone.rank}阶`}
                    />
                  </div>
                </Box>
              </Tooltip>
            ) : (
              <Typography level="title-md" color="danger" ml={1}>未装备</Typography>
            )}
            

            <Divider sx={{ '--Divider-childPosition': '24px', my: 0.5 }}>技能等级</Divider>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                px: 1
              }}
            >
              {character.skills.map(skill => (
                <Box
                  key={skill.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <img src={STATE.resUrl + skill.icon} width={24} height={24} />
                  <Typography level="body-xs">{skill.type_text}</Typography>
                  <Typography
                    level="body-xs"
                    textColor="common.black"
                    lineHeight="1.3em"
                    children={skill.level + (skill.rankLevelUp ? '+' + skill.rankLevelUp : '')}
                    sx={{
                      mt: 0.5,
                      px: 0.5,
                      fontSize: '10px',
                      borderRadius: '1em',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <MyCharacterProperties character={character} />
      </BlackSheet>
    </Box>
  );
}

/*
            <Typography
              level="title-md"
              children={nickname(character.name)}
              onClick={handleNameClick}
              sx={{
                position: 'absolute',
                zIndex: 3,
                bottom: '4px',
                left: 0,
                right: 0,
                lineHeight: '1.6em',
                textAlign: 'center',
                backgroundColor: '#00000099',
                overflow: 'hidden',
                textWrap: 'nowrap',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                zIndex: 2,
                bottom: '20px',
                left: 0,
                right: 0,
                textAlign: 'center'
              }}
            >
              <Rarity rarity={character.rarity} height={16} />
            </Box>
            <Typography
              level="body-xs"
              textColor="common.black"
              children={'Lv.' + character.level}
              sx={{
                position: 'absolute',
                zIndex: 3,
                top: '8px',
                right: '8px',
                px: 0.5,
                borderRadius: '4px',
                backgroundColor: '#ffffffa0'
              }}
            />
            <Typography
              level="body-xs"
              textColor="common.black"
              children={character.rank + '星魂'}
              sx={{
                position: 'absolute',
                zIndex: 3,
                top: '32px',
                right: '8px',
                px: 0.5,
                borderRadius: '4px',
                backgroundColor: '#ffffffa0'
              }}
            />

            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1
              }}
            >
              <Box display="flex" gap={0.5} justifyContent="space-around">
                {categorizedSkillTrees.ExtraCapacity.map((skillTree => (
                  <Box key={skillTree.id}>
                    <img src={STATE.resUrl + skillTree.icon} alt="" width={28} height={28} />
                  </Box>
                )))}
              </Box>
              <Box flexGrow={1}>
                <Box display="flex" justifyContent="space-around">
                  {categorizedSkillTrees.PropertyAddition.slice(0, 5).map(skillTree => (
                    <Box key={skillTree.id}>
                      <img src={STATE.resUrl + skillTree.icon} alt="" width={18} height={18} />
                    </Box>
                  ))}
                </Box>
                <Box display="flex" justifyContent="space-around">
                  {categorizedSkillTrees.PropertyAddition.slice(5, 10).map(skillTree => (
                    <Box key={skillTree.id}>
                      <img src={STATE.resUrl + skillTree.icon} alt="" width={18} height={18} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
*/
