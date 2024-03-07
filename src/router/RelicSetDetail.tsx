import { Suspense, useCallback, useMemo, useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Slider from '@mui/joy/Slider';

import Loading from '../component/Loding';
import BackButton from '../component/BackButton';
import FlexItem from '../component/FlexItem';
import BlackSheet from '../component/BlackSheet';
import PropertyItem from '../component/PropertyItem';
import { STATE } from '../common/state';
import { RelicSetDetailData } from './loaders';
import { formatProperty, relicMainValue, relicMainValueFormula, relicSubValue, relicSubValueFormula, relicTypeMap, setMap, showPercent } from '../data/local';
import { imageTheme } from '../common/theme';
import { backgroundStriped } from '../common/utils';

export default function RelicSetDetail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useLoaderData() as any;

  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={data.relicSetDetailData}
        children={({ relicSet }: RelicSetDetailData) => {
          return (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  p: { md: 1 },
                  mb: '72px'
                }}
              >
                <SetsDetail relicSet={relicSet} />
                <SubAffixPromotionTable />
                <MainAffixPromotionTable />
              </Box>
              <BackButton />
            </>
          );
        }}
      />
    </Suspense>
  );
}

interface SetsDetailProps {
  relicSet: RelicSet;
}

function SetsDetail({ relicSet }: SetsDetailProps) {
  const relics: Relic[] = useMemo(() => {
    const list: Relic[] = [];
    Object.keys(STATE.starRailData.relics).forEach(key => {
      const relic = STATE.starRailData.relics[key];
      if (relic.set_id === relicSet.id && relic.rarity === 5) {
        list.push(relic);
      }
    });
    return list;
  }, [relicSet.id]);

  return (
    <FlexItem>
      <BlackSheet>
        <Box display="flex" alignItems="center" gap={1} px={1} pt={2} pb={1}>
          <img src={(relicSet.isTest ? STATE.hsrApiUrl : STATE.resUrl) + relicSet.icon} alt="" width={42} height={42} />
          <Typography level="h4" mr="auto">{relicSet.name}</Typography>
        </Box>
        <Divider sx={{ '--Divider-childPosition': '24px', px: 1.5 }}>套装效果</Divider>
        <div>
          {relicSet.desc.map((desc, i) => (
            <Typography
              key={i}
              level="body-sm"
              textColor={imageTheme.rankColor}
              px={3}
              py={1}
              display={desc === '' ? 'none' : 'block'}
              children={setMap[(i + 1) * 2] + desc}
            />
          ))}
        </div>
        <Divider sx={{ '--Divider-childPosition': '24px', mt: 1, px: 1.5 }}>部位列表</Divider>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            pt: 2
          }}
        >
          {relics.map(relic => (
            <Box
              key={relic.id}
              sx={{
                flexGrow: 1,
                px: 2,
                py: 1,
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
                  <img src={(relic.isTest ? STATE.hsrApiUrl : STATE.resUrl) + relic.icon} alt="" width="100%" height="100%" />
                </Box>
                <div>
                  <Typography level="title-sm" whiteSpace="nowrap">{relic.name}</Typography>
                  <Typography level="body-sm">{relicTypeMap[relic.type]}</Typography>
                </div>
              </Box>

              <MainAffixSelect id={relic.main_affix_id} />
            </Box>
          ))}
        </Box>
      </BlackSheet>
    </FlexItem>
  );
}

interface MainAffixSelectProps {
  id: string;
}

function MainAffixSelect({ id }: MainAffixSelectProps) {
  const affixes = useMemo(() => {
    const affixes = STATE.starRailData.relic_main_affixes[id].affixes;
    return Object.keys(affixes).map(key => {
      const affix = affixes[key];
      return Object.assign({}, affix, { property: STATE.starRailData.properties[affix.property] });
    });
  }, [id]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = useCallback((_: any, value: number) => setSelectedIndex(value), []);

  const randerValue = useCallback(() => {
    const affix = affixes[selectedIndex];
    if (affix) {
      return (
        <PropertyItem
          icon={STATE.resUrl + affix.property.icon}
          name={affix.property.name + showPercent(affix.property.type)}
          value={null}
        />
      );
    } else {
      return null;
    }
  }, [affixes, selectedIndex]);

  return (
    <Select
      color="primary"
      disabled={affixes.length < 2}
      value={selectedIndex}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={handleChange as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderValue={randerValue as any}
    >
      {affixes.map((affix, i) => (
        <Option key={i} value={i}>
          <PropertyItem
            icon={STATE.resUrl + affix.property.icon}
            name={affix.property.name + showPercent(affix.property.type)}
            value={null}
          />
        </Option>
      ))}
    </Select>
  );
}

function MainAffixPromotionTable() {
  const [level, setLevel] = useState(15);

  const mainAffixes = useMemo(() => {
    const list: (MainAffix & { property: Property })[] = [];
    let part = 1;
    while (part < 7) {
      const affixes = STATE.starRailData.relic_main_affixes[`5${part}`].affixes;
      Object.keys(affixes).forEach(key => {
        const affix = affixes[key];
        if (list.every(value => value.property.type !== affix.property)) {
          list.push(Object.assign({}, affix, {
            property: STATE.starRailData.properties[affix.property]
          }));
        }
      });
      part++;
    }
    return list;
  }, []);

  const handleLevelChange = useCallback((_: Event, value: number) => setLevel(value), []);

  return (
    <FlexItem>
      <BlackSheet>
        <Typography level="title-lg" color="warning" component="h6" px={1} pt={2} pb={1}>主词条强化</Typography>
        <Box display="flex" alignItems="center">
          <Typography level="title-sm" color="neutral" px={1}>强化等级：</Typography>
          <Box flexGrow={1} py={1.5} pr={3}>
            <Slider
              valueLabelDisplay="on"
              min={0}
              max={15}
              value={level}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={handleLevelChange as any}
            />
          </Box>
        </Box>

        {mainAffixes.map((affix, i) => (
          <PropertyItem
            key={i}
            icon={STATE.resUrl + affix.property.icon}
            name={affix.property.name + showPercent(affix.property.type)}
            value={
              relicMainValueFormula(affix, level, affix.property.percent) +
              formatProperty(relicMainValue(affix, level), affix.property.percent, 2, 2)
            }
            sx={backgroundStriped(i % 2 === 0)}
          />
        ))}
      </BlackSheet>
    </FlexItem>
  );
}

function SubAffixPromotionTable() {
  const [cnt, setCnt] = useState(6);
  const [step, setStep] = useState(12);

  const subAffixes = useMemo(() => {
    const list: (SubAffix & { property: Property })[] = [];
    const affixes = STATE.starRailData.relic_sub_affixes['5'].affixes;
    Object.keys(affixes).forEach(key => {
      const affix = affixes[key];
      if (list.every(value => value.property.type !== affix.property)) {
        list.push(Object.assign({}, affix, {
          property: STATE.starRailData.properties[affix.property]
        }));
      }
    });
    return list;
  }, []);

  const handleCntChange = useCallback((_: Event, value: number) => {
    setCnt(value);
    if (step > value * 2) {
      setStep(value * 2);
    }
  }, [step]);

  const handleStepChange = useCallback((_: Event, value: number) => setStep(value), []);

  return (
    <FlexItem>
      <BlackSheet>
        <Typography level="title-lg" color="danger" component="h6" px={1} pt={2} pb={1}>副词条强化</Typography>
        <Box display="flex" alignItems="center">
          <Typography level="title-sm" color="neutral" px={1}>强化次数：</Typography>
          <Box flexGrow={1} py={1.5} pr={3}>
            <Slider
              valueLabelDisplay="on"
              min={1}
              max={6}
              marks={[{ value: 1, label: '1次' }, { value: 6, label: '6次' }]}
              value={cnt}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={handleCntChange as any}
            />
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center">
          <Typography level="title-sm" color="neutral" px={1}>步进次数：</Typography>
          <Box flexGrow={1} py={1.5} pr={3}>
            <Slider
              valueLabelDisplay="on"
              min={0}
              max={cnt * 2}
              marks={[{ value: 0, label: '0次' }, { value: cnt * 2, label: cnt * 2 + '次' }]}
              value={step}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={handleStepChange as any}
            />
          </Box>
        </Box>

        {subAffixes.map((affix, i) => (
          <PropertyItem
            key={i}
            icon={STATE.resUrl + affix.property.icon}
            name={affix.property.name + showPercent(affix.property.type)}
            value={
              relicSubValueFormula(affix, cnt, step, affix.property.percent) +
              formatProperty(relicSubValue(affix, cnt, step), affix.property.percent, 2, 2)
            }
            sx={backgroundStriped(i % 2 === 0)}
          />
        ))}
      </BlackSheet>
    </FlexItem>
  );
}
