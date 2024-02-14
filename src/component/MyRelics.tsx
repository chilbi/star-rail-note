import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import Tooltip from '@mui/joy/Tooltip';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Slider from '@mui/joy/Slider';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import BlackSheet from './BlackSheet';
import PropertyItem from './PropertyItem';
import SubAffixRate from './SubAffixRate';
import { STATE } from '../common/state';
import { relicTypeMap, setMap, showPercent } from '../data/local';
import { imageTheme } from '../common/theme';
import { RelicFields, assignWeights, getDefaultWeights, getFieldType } from '../data/parseRelicScore';
import { backgroundStriped } from '../common/utils';
import Chip from '@mui/joy/Chip';

interface MyRelicsProps {
  character: CharacterInfo;
  updater: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MyRelics({ character, updater }: MyRelicsProps) {
  const [weightOpen, setWeightOpen] = useState(false);
  const handleWeightOpen = useCallback(() => setWeightOpen(true), []);
  const handleWeightClose = useCallback(() => setWeightOpen(false), []);

  const [scoreOpen, setScoreOpen] = useState(false);
  const handleScoreOpen = useCallback(() => setScoreOpen(true), []);
  const handleScoreClose = useCallback(() => setScoreOpen(false), []);

  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const handlePropertiesOpen = useCallback(() => setPropertiesOpen(true), []);
  const handlePropertiesClose = useCallback(() => setPropertiesOpen(false), []);
  
  const setIds: string[] = [];

  return (
    <BlackSheet>
      <Divider sx={{ '--Divider-childPosition': '24px', mt: 2, mb: 1 }}>
        <span>遗器属性推荐</span>
        <Tooltip title="修改遗器属性权重" color="primary" arrow>
          <IconButton color="primary" size="lg" onClick={handleWeightOpen} sx={{ ml: 0.5 }}>
            <EditNoteRoundedIcon />
          </IconButton>
        </Tooltip>
      </Divider>
      <Box display="flex" alignItems="center">
        <MyRelicsRecommendProperties propertiesGroups={character.totalRelicScore.recommendPropertiesGroups} />
        <Tooltip title="属性完成度详情" color="primary" arrow>
          <Typography
            level="h3"
            color="danger"
            children={character.totalRelicScore.scoreDisplay}
            onClick={handleScoreOpen}
            sx={{
              mr: 3,
              ml: 'auto',
              cursor: 'pointer'
            }}
          />
        </Tooltip>
      </Box>

      <Divider sx={{ '--Divider-childPosition': '24px', mt: 2, mb: 1 }}>
        <span>遗器属性详情</span>
        <Tooltip title="查看遗器总属性" color="primary" arrow>
          <IconButton onClick={handlePropertiesOpen} sx={{ ml: 0.5 }}>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Divider>
      <Box
        sx={{
          // display: 'flex',
          // flexWrap: 'wrap',
          // pb: 1
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: { xs: 0.5, md: 1 }
        }}
      >
        {character.relics.map(relic => (
          <MyRelic
            key={relic.id}
            relic={relic}
            relicScore={character.relicScoreRecord[relic.type]}
            recommendAffixes={character.recommendAffixes}
          />
        ))}
      </Box>

      {character.relic_sets.length > 0 && (
        <>
          <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>遗器套装效果</Divider>
          <div>
            {character.relic_sets.map((relicSet, i) => {
              const notExistingSet = setIds.indexOf(relicSet.id) < 0;
              setIds.push(relicSet.id);
              return (
                <Box key={i} p={1}>
                  {notExistingSet && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <img src={STATE.resUrl + relicSet.icon} width={36} height={36} />
                      <Typography level="title-md" ml={1}>{relicSet.name}</Typography>
                    </Box>
                  )}
                  <Typography level="body-sm" textColor="#18ffcd" pl={2} pr={1}>{setMap[relicSet.num] + relicSet.desc}</Typography>
                </Box>
              );
            })}
          </div>
        </>
      )}

      <MyRelicsWeight
        recommendAffixes={character.recommendAffixes}
        characterId={character.id}
        pathId={character.path.id}
        elementId={character.element.id}
        open={weightOpen}
        onClose={handleWeightClose}
        updater={updater}
      />

      <MyRelicsScore
        relicScoreRecord={character.relicScoreRecord}
        totalRelicScore={character.totalRelicScore}
        open={scoreOpen}
        onClose={handleScoreClose}
      />

      <MyRelicsProperites
        relicsProperties={character.relicsProperties}
        open={propertiesOpen}
        onClose={handlePropertiesClose}
      />
    </BlackSheet>
  );
}

interface MyRelicsRecommendPropertiesProps {
  propertiesGroups: RecommendPropertiesGroup[];
}

function MyRelicsRecommendProperties({ propertiesGroups }: MyRelicsRecommendPropertiesProps) {
  if (propertiesGroups.length < 1) {
    return (
      <Typography
        level="body-sm"
        children="任意属性"
        textColor="text.primary"
        px={3}
      />
    )
  }
  return (
    <Box px={3} display="flex" flexWrap="wrap" alignItems="center">
      {propertiesGroups.map((group, i) => {
        return (
          <Fragment key={i}>
            {i !== 0 && (
              <Typography
                level="body-xs"
                color="warning"
                component="span"
                mx={0.5}
                children="&gt;"
              />
            )}
            <Typography
              level="body-xs"
              color="danger"
              component="span"
              mx={0.5}
              children={group.weight}
            />
            {group.properties.map((property, index) => (
              <Fragment key={property.type}>
                {index !== 0 && (
                  <Typography
                    level="body-xs"
                    color="warning"
                    component="span"
                    mx={0.5}
                    children="="
                  />
                )}
                <Typography
                  level="body-xs"
                  textColor="text.primary"
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={STATE.resUrl + property.icon}
                    alt=""
                    width={18}
                    height={18}
                  />
                  {property.name}
                </Typography>
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </Box>
  )
}

interface MyRelicsPropertiesProps {
  relicsProperties: PropertyInfo[];
  open: boolean;
  onClose: () => void;
}

function MyRelicsProperites({ relicsProperties, open, onClose }: MyRelicsPropertiesProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg" color="primary" sx={{ width: '100%', maxWidth: '640px' }}>
        <ModalClose size="lg" />
        <DialogTitle>遗器总属性</DialogTitle>
        <DialogContent>
          {relicsProperties.map((property, i) => (
            <PropertyItem
              key={property.type}
              icon={STATE.resUrl + property.icon}
              name={property.name + showPercent(property.type)}
              value={property.display}
              sx={backgroundStriped(i % 2 === 0)}
            />
          ))}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

interface ScoreDisplayProps {
  label: string;
  myScore: string;
  bestScore: string;
  score: string;
}

function ScoreDisplay({ label, myScore, bestScore, score }: ScoreDisplayProps) {
  return (
    <Box display="flex" alignItems="center">
      <Typography level="body-xs" width={50} mr={1}>{label}</Typography>
      <Chip variant="solid" color="warning" size="sm">
        <Box component="span" display="inline-block" textAlign="center" width={48}>{myScore}</Box>
      </Chip>
      <Typography level="body-sm" px={0.5}>/</Typography>
      <Chip variant="solid" color="success" size="sm">
        <Box component="span" display="inline-block" textAlign="center" width={48}>{bestScore}</Box>
      </Chip>
      <Typography level="body-sm" px={0.5}>=</Typography>
      <Chip variant="solid" color="danger" size="sm">
        <Box component="span" display="inline-block" textAlign="center" width={48}>{score}</Box>
      </Chip>
    </Box>
  );
}

interface MyRelicsScoreProps {
  relicScoreRecord: Record<RelicTypes, RelicScore>;
  totalRelicScore: TotalRelicScore;
  open: boolean;
  onClose: () => void;
}

function MyRelicsScore({ relicScoreRecord, totalRelicScore, open, onClose }: MyRelicsScoreProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg" color="primary" sx={{ width: '100%', maxWidth: '640px' }}>
        <ModalClose size="lg" />
        <DialogTitle>遗器属性完成度</DialogTitle>
        <DialogContent>
          <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>
            <span>合计</span>
            <Typography level="h4" color="danger" ml={0.5}>{totalRelicScore.scoreDisplay}</Typography>
          </Divider>
          <ScoreDisplay
            label="主词条"
            myScore={totalRelicScore.myMainScoreDisplay}
            bestScore={totalRelicScore.bestMainScoreDisplay}
            score={totalRelicScore.mainScoreDisplay}
          />
          <ScoreDisplay
            label="副词条"
            myScore={totalRelicScore.mySubScoreDisplay}
            bestScore={totalRelicScore.bestSubScoreDisplay}
            score={totalRelicScore.subScoreDisplay}
          />
          <ScoreDisplay
            label="套装效果"
            myScore={totalRelicScore.mySetScoreDisplay}
            bestScore={totalRelicScore.bestSetScoreDisplay}
            score={totalRelicScore.setScoreDisplay}
          />
          {Object.keys(relicScoreRecord).map(key => {
            const relicScore = relicScoreRecord[key as RelicTypes];
            return (
              <Fragment key={key}>
                <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>
                  <span>{relicTypeMap[key as RelicTypes]}</span>
                  <Typography level="title-md" color="danger" ml={0.5}>{relicScore.scoreDisplay}</Typography>
                </Divider>
                {!relicScore.isHeadOrHand && (
                  <ScoreDisplay
                    label="主词条"
                    myScore={relicScore.myMainScoreDisplay}
                    bestScore={relicScore.bestMainScoreDisplay}
                    score={relicScore.mainScoreDisplay}
                  />
                )}
                <ScoreDisplay
                  label="副词条"
                  myScore={relicScore.mySubScoreDisplay}
                  bestScore={relicScore.bestSubScoreDisplay}
                  score={relicScore.subScoreDisplay}
                />
              </Fragment>
            );
          })}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

const marks = [{ value: 0.25 }, { value: 0.5 }, { value: 0.75 }];

interface MyRelicsWeightProps {
  recommendAffixes: RecommendAffix[];
  characterId: string;
  pathId: string;
  elementId: string;
  open: boolean;
  onClose: () => void;
  updater: React.Dispatch<React.SetStateAction<boolean>>;
}

function MyRelicsWeight({ recommendAffixes, characterId, pathId, elementId, open, onClose, updater }: MyRelicsWeightProps) {
  const inUseWeights = useMemo(() => assignWeights(recommendAffixes), [recommendAffixes]);
  const [weights, setWeights] = useState(inUseWeights);
  const [disabledSave, setDisabledSave] = useState(true);

  useEffect(() => {
    setWeights(inUseWeights);
  }, [inUseWeights]);

  useEffect(() => {
    const hasDiff = Object.keys(inUseWeights).some(key => {
      return inUseWeights[key as RelicFields] !== weights[key as RelicFields];
    });
    setDisabledSave(!hasDiff);
  }, [inUseWeights, weights]);

  const handleClose = useCallback(() => {
    setWeights(inUseWeights);
    onClose();
  }, [inUseWeights, onClose]);

  const handleReset = useCallback(() => {
    setWeights(getDefaultWeights(characterId, pathId))
  }, [characterId, pathId]);

  const handleSave = useCallback(() => {
    const defaultWeights = getDefaultWeights(characterId, pathId);
    const hasDiff = Object.keys(weights).some(key => {
      return weights[key as RelicFields] !== defaultWeights[key as RelicFields];
    });
    if (hasDiff) {
      STATE.setLocalFieldsRecord(characterId, weights);
    } else {
      STATE.deleteLocalFields(characterId);
    }
    updater(prev => !prev);
    onClose();
  }, [characterId, pathId, weights, onClose, updater]);

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog layout="fullscreen" size="lg" color="primary">
        <ModalClose size="lg" />
        <DialogTitle>遗器属性权重</DialogTitle>
        <DialogContent>
          <DialogActions>
            <Button
              children="保存修改"
              color="danger"
              startDecorator={<SaveRoundedIcon />}
              disabled={disabledSave}
              onClick={handleSave}
            />
            <Button
              children="重置默认值"
              color="success"
              startDecorator={<RestartAltRoundedIcon />}
              onClick={handleReset}
            />
          </DialogActions>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
              gap: 1,
              my: 1
            }}
          >
            {Object.entries(weights).map(([field, weight]) => {
              const type = getFieldType(field as RelicFields, elementId);
              const property = STATE.starRailData.properties[type];
              return (
                <Box key={field}>
                  <PropertyItem
                    icon={STATE.resUrl + property.icon}
                    name={<Box component="span" display="inline-block" width="110px">{property.name}</Box>}
                    value={null}
                    sx={backgroundStriped(false)}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Slider
                        value={weight}
                        min={0}
                        max={1}
                        step={0.25}
                        marks={marks}
                        onChange={(_, value) => setWeights(prev => Object.assign({}, prev, { [field]: value }))}
                        sx={{ p: '18px 0' }}
                      />
                      <Typography
                        level="body-xs"
                        children={weight}
                        textAlign="center"
                        textColor="text.primary"
                        display="inline-block"
                        width="80px"
                      />
                    </Box>
                  </PropertyItem>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

interface MyRelicProps {
  relic: RelicInfo;
  relicScore: RelicScore;
  recommendAffixes: RecommendAffix[];
}

function MyRelic({ relic, relicScore, recommendAffixes }: MyRelicProps) {
  return (
    <Box mb={1}>
      <Box display="flex" gap={0.5} mb={0.5}>
        <Box
          sx={{
            width: 33,
            height: 33,
            p: '3px',
            borderRadius: '50%',
            backgroundImage: imageTheme.getItemRarityImageColor(relic.rarity)
          }}
        >
          <img src={STATE.resUrl + relic.icon} alt="" width="100%" height="100%" />
        </Box>
        <Box flexGrow={1}>
          <Typography level="title-sm">{relic.name}</Typography>
          <Box display="flex" alignItems="center">
            <Typography level="body-sm">{relicTypeMap[relic.type]}</Typography>
            <Typography level="body-xs" color="warning" ml={0.25}>{'+' + relic.level}</Typography>
            <Typography level="body-xs" color="danger" ml="auto">{relicScore.scoreDisplay}</Typography>
          </Box>
        </Box>
      </Box>

      <div>
        <PropertyItem
          icon={STATE.resUrl + relic.main_affix.icon}
          name={relic.main_affix.name}
          value={relic.main_affix.display}
          textColor={!relicScore.isHeadOrHand && recommendAffixes.some(value => value.type === relic.main_affix.type) ? 'warning.400' : undefined }
          sx={{ backgroundColor: imageTheme.previewRarityColors[relic.rarity] + '66' }}
        />
        {relic.sub_affix.map((affix, i) => (
          <PropertyItem
            key={i}
            icon={STATE.resUrl + affix.icon}
            name={<>{affix.name}<SubAffixRate count={affix.count} step={affix.step} /></>}
            value={affix.display}
            textColor={recommendAffixes.some(value => value.type === affix.type) ? 'warning.400' : undefined}
            sx={backgroundStriped(i % 2 !== 0)}
          />
        ))}
      </div>
    </Box>
  );
}
