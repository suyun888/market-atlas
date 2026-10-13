/**
 * Market Atlas demonstration data.
 *
 * The final statistics are transcribed from the supplied video. All intermediate
 * points are deterministic visual illustrations, not historical daily prices or
 * an independently verified investment backtest.
 *
 * Usage:
 *   import { MARKETS, PORTFOLIOS, EVENTS, getSeries } from './data.js';
 *   const points = getSeries('nasdaq'); // 250 { year, value } points
 *   const comparison = getSeries('optimal');
 *   // value is cumulative return in percent: 100 means +100%, not 1.00.
 */

export const DATA_START = 2010;
export const DATA_END = 2026.77;
export const SAMPLE_COUNT = 250;
export const DATA_NOTE =
  '终点收益与配置数据来自参考视频；中间曲线为视觉演示模拟，并非真实逐日行情或回测。历史最优比例存在后视偏差，不代表未来表现。';

export const KEY_YEARS = [2010, 2014, 2018, 2022, 2026];

export const MARKETS = [
  {
    id: 'nasdaq',
    name: '纳斯达克 100',
    shortName: '纳指 100',
    englishName: 'NASDAQ 100',
    flag: '🇺🇸',
    region: '美国',
    exchange: 'NASDAQ',
    color: '#b99afa',
    monthly: 1190,
    weight: 1190 / 3000,
    endReturn: 574.6,
    coordinates: [-74.006, 40.713],
  },
  {
    id: 'sp500',
    name: '标普 500',
    shortName: '标普 500',
    englishName: 'S&P 500',
    flag: '🇺🇸',
    region: '美国',
    exchange: 'NYSE',
    color: '#74c6ec',
    monthly: 920,
    weight: 920 / 3000,
    endReturn: 304.0,
    coordinates: [-73.72, 40.88],
  },
  {
    id: 'nikkei',
    name: '日经 225',
    shortName: '日经 225',
    englishName: 'NIKKEI 225',
    flag: '🇯🇵',
    region: '日本',
    exchange: 'TOKYO',
    color: '#a2dfc8',
    monthly: 270,
    weight: 270 / 3000,
    endReturn: 204.8,
    coordinates: [139.692, 35.690],
  },
  {
    id: 'csi300',
    name: '沪深 300',
    shortName: '沪深 300',
    englishName: 'CSI 300',
    flag: '🇨🇳',
    region: '中国',
    exchange: 'SHANGHAI · SHENZHEN',
    color: '#ef8589',
    monthly: 320,
    weight: 320 / 3000,
    endReturn: 50.6,
    coordinates: [121.474, 31.230],
  },
  {
    id: 'dax',
    name: '德国 DAX',
    shortName: '德国 DAX',
    englishName: 'DAX',
    flag: '🇩🇪',
    region: '德国',
    exchange: 'FRANKFURT',
    color: '#edbc73',
    monthly: 150,
    weight: 150 / 3000,
    endReturn: 104.6,
    coordinates: [8.682, 50.111],
  },
  {
    id: 'cac40',
    name: '法国 CAC 40',
    shortName: '法国 CAC 40',
    englishName: 'CAC 40',
    flag: '🇫🇷',
    region: '法国',
    exchange: 'PARIS',
    color: '#98a3bc',
    monthly: 150,
    weight: 150 / 3000,
    endReturn: 92.4,
    coordinates: [2.352, 48.857],
  },
];

export const PORTFOLIOS = [
  {
    id: 'optimal',
    name: '历史最优配置',
    shortName: '最优配置',
    color: '#e9c887',
    endReturn: 354.8,
    endingValue: 2756014,
    totalPrincipal: 606000,
    monthly: 3000,
    periods: 202,
    irr: 16.21,
    maxDrawdown: -28.0,
    allocations: MARKETS.map(({ id, monthly, weight }) => ({
      marketId: id,
      monthly,
      weight,
    })),
  },
  {
    id: 'equal',
    name: '六市场平均配置',
    shortName: '平均配置',
    color: '#bac4d6',
    endReturn: 221.8,
    endingValue: 1950077,
    totalPrincipal: 606000,
    monthly: 3000,
    periods: 202,
    allocations: MARKETS.map(({ id }) => ({
      marketId: id,
      monthly: 500,
      weight: 1 / 6,
    })),
  },
];

export const EVENTS = [
  {
    id: 'euro-debt',
    year: 2011.67,
    displayYear: '2011',
    label: '欧债危机',
    title: '欧债危机',
    description: '债务担忧蔓延，全球市场承压，长期定投经历第一轮考验。',
    color: '#edbc73',
    marketIds: ['dax', 'cac40', 'sp500'],
  },
  {
    id: 'abenomics',
    year: 2013.33,
    displayYear: '2013',
    label: '安倍经济学',
    title: '安倍经济学',
    description: '宽松政策推动日股重估，日本市场迎来新的上升周期。',
    color: '#a2dfc8',
    marketIds: ['nikkei'],
  },
  {
    id: 'china-volatility',
    year: 2015.50,
    displayYear: '2015',
    label: 'A 股大波动',
    title: 'A 股大波动',
    description: '快速上涨后的剧烈调整，让风险与回撤变得具体可见。',
    color: '#ef8589',
    marketIds: ['csi300'],
  },
  {
    id: 'pandemic',
    year: 2020.23,
    displayYear: '2020',
    label: '全球疫情',
    title: '全球疫情',
    description: '全球市场短暂急跌，随后在宽松政策与经济重启中分化。',
    color: '#bac4d6',
    marketIds: MARKETS.map(({ id }) => id),
  },
  {
    id: 'rate-hikes',
    year: 2022.75,
    displayYear: '2022',
    label: '全球加息',
    title: '全球加息',
    description: '通胀与利率上升压低资产估值，科技股经历显著回撤。',
    color: '#74c6ec',
    marketIds: ['nasdaq', 'sp500', 'dax', 'cac40'],
  },
  {
    id: 'ai-boom',
    year: 2024.35,
    displayYear: '2024',
    label: 'AI 浪潮',
    title: 'AI 浪潮',
    description: '人工智能产业带动科技行情，美股与全球市场的表现拉开差距。',
    color: '#b99afa',
    marketIds: ['nasdaq', 'sp500'],
  },
  {
    id: 'tariffs',
    year: 2025.27,
    displayYear: '2025',
    label: '关税冲击',
    title: '关税冲击',
    description: '贸易政策的不确定性引发震荡，分散配置再次接受检验。',
    color: '#edbc73',
    marketIds: MARKETS.map(({ id }) => id),
  },
];

// These hand-authored anchors communicate the broad shape of the period.
// They intentionally do not purport to reproduce actual index observations.
const ANCHORS = {
  nasdaq: [
    [2010, 0], [2010.9, 8], [2011.67, -6], [2012.9, 22],
    [2013.9, 45], [2014.9, 67], [2015.67, 54], [2016.9, 82],
    [2017.9, 130], [2018.75, 171], [2018.98, 111], [2019.95, 196],
    [2020.23, 129], [2020.93, 292], [2021.9, 366], [2022.75, 211],
    [2023.9, 364], [2024.9, 470], [2025.27, 354], [2025.95, 510],
    [DATA_END, 574.6],
  ],
  sp500: [
    [2010, 0], [2010.9, 6], [2011.67, -9], [2012.9, 13],
    [2013.9, 33], [2014.9, 48], [2015.67, 39], [2016.9, 60],
    [2017.9, 85], [2018.75, 104], [2018.98, 68], [2019.95, 116],
    [2020.23, 48], [2020.93, 141], [2021.9, 200], [2022.75, 142],
    [2023.9, 213], [2024.9, 262], [2025.27, 204], [2025.95, 285],
    [DATA_END, 304],
  ],
  nikkei: [
    [2010, 0], [2010.9, -4], [2011.67, -15], [2012.9, -3],
    [2013.33, 22], [2013.9, 34], [2014.9, 45], [2015.5, 66],
    [2015.9, 48], [2016.3, 32], [2016.9, 48], [2017.9, 73],
    [2018.98, 48], [2019.95, 77], [2020.23, 34], [2020.93, 104],
    [2021.9, 125], [2022.75, 96], [2023.9, 153], [2024.55, 204],
    [2024.67, 169], [2024.95, 187], [2025.27, 160], [2025.95, 191],
    [DATA_END, 204.8],
  ],
  csi300: [
    [2010, 0], [2010.9, -8], [2011.67, -21], [2012.9, -15],
    [2013.9, -18], [2014.5, -12], [2014.95, 18], [2015.42, 74],
    [2015.67, 22], [2016.15, 0], [2016.9, 12], [2017.9, 29],
    [2018.98, 2], [2019.95, 29], [2020.23, 16], [2020.93, 59],
    [2021.12, 76], [2021.9, 48], [2022.75, 19], [2023.9, 14],
    [2024.7, 8], [2024.77, 44], [2024.95, 31], [2025.27, 22],
    [2025.95, 44], [DATA_END, 50.6],
  ],
  dax: [
    [2010, 0], [2010.9, 8], [2011.67, -19], [2012.9, 3],
    [2013.9, 22], [2014.9, 30], [2015.3, 43], [2015.67, 23],
    [2016.9, 30], [2017.9, 48], [2018.98, 19], [2019.95, 44],
    [2020.23, 1], [2020.93, 43], [2021.9, 64], [2022.75, 24],
    [2023.9, 66], [2024.9, 83], [2025.27, 61], [2025.95, 95],
    [DATA_END, 104.6],
  ],
  cac40: [
    [2010, 0], [2010.9, 1], [2011.67, -22], [2012.9, -4],
    [2013.9, 11], [2014.9, 15], [2015.3, 30], [2015.67, 13],
    [2016.9, 22], [2017.9, 36], [2018.98, 17], [2019.95, 43],
    [2020.23, -1], [2020.93, 38], [2021.9, 67], [2022.75, 37],
    [2023.9, 75], [2024.5, 88], [2024.95, 73], [2025.27, 59],
    [2025.95, 83], [DATA_END, 92.4],
  ],
  optimal: [
    [2010, 0], [2010.9, 5], [2011.67, -10], [2012.9, 11],
    [2013.9, 29], [2014.9, 46], [2015.42, 62], [2015.67, 40],
    [2016.9, 61], [2017.9, 93], [2018.75, 119], [2018.98, 80],
    [2019.95, 136], [2020.23, 73], [2020.93, 183], [2021.9, 241],
    [2022.75, 159], [2023.9, 248], [2024.9, 307], [2025.27, 236],
    [2025.95, 325], [DATA_END, 354.8],
  ],
  equal: [
    [2010, 0], [2010.9, 2], [2011.67, -15], [2012.9, 2],
    [2013.9, 19], [2014.9, 34], [2015.42, 51], [2015.67, 29],
    [2016.9, 43], [2017.9, 67], [2018.75, 84], [2018.98, 47],
    [2019.95, 94], [2020.23, 40], [2020.93, 129], [2021.9, 165],
    [2022.75, 108], [2023.9, 166], [2024.9, 195], [2025.27, 153],
    [2025.95, 209], [DATA_END, 221.8],
  ],
};

const SERIES_CACHE = new Map();

function interpolate(anchors, year, phase) {
  let index = 0;
  while (index < anchors.length - 2 && anchors[index + 1][0] < year) {
    index += 1;
  }
  const [startYear, startValue] = anchors[index];
  const [endYear, endValue] = anchors[index + 1];
  const t = Math.min(1, Math.max(0, (year - startYear) / (endYear - startYear)));
  const eased = t * t * (3 - 2 * t);
  const baseline = startValue + (endValue - startValue) * eased;
  // The envelope preserves every anchor and the final statistics exactly.
  const envelope = Math.sin(Math.PI * t);
  const amplitude = 1.7 + Math.abs(baseline) * 0.018;
  const ripple =
    Math.sin(year * 29 + phase) * 0.60 +
    Math.sin(year * 63 + phase * 1.73) * 0.28 +
    Math.sin(year * 11 + phase * 2.31) * 0.12;
  return baseline + envelope * amplitude * ripple;
}

/**
 * Return a reproducible simulated cumulative-return curve for a market or
 * portfolio. Accepts an id string or any object containing an id. Unknown ids
 * return an empty array. Custom sample counts must be at least two.
 */
export function getSeries(marketOrId, sampleCount = SAMPLE_COUNT) {
  const id = typeof marketOrId === 'string' ? marketOrId : marketOrId?.id;
  const anchors = ANCHORS[id];
  if (!anchors) return [];
  const requested = Number(sampleCount);
  const count = Number.isFinite(requested)
    ? Math.max(2, Math.floor(requested))
    : SAMPLE_COUNT;
  const cacheKey = `${id}:${count}`;
  if (!SERIES_CACHE.has(cacheKey)) {
    const phase = [...id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) / 11;
    SERIES_CACHE.set(
      cacheKey,
      Array.from({ length: count }, (_, index) => {
        const year = DATA_START + ((DATA_END - DATA_START) * index) / (count - 1);
        const value = index === 0
          ? 0
          : index === count - 1
            ? anchors[anchors.length - 1][1]
            : interpolate(anchors, year, phase);
        return Object.freeze({ year, value });
      }),
    );
  }
  // Return a fresh array so chart sorting and slicing cannot affect the cache.
  return SERIES_CACHE.get(cacheKey).slice();
}

/** Return a linearly interpolated percentage for a timeline cursor. */
export function getValueAtYear(marketOrId, year) {
  const series = getSeries(marketOrId);
  if (!series.length) return 0;
  const bounded = Math.max(DATA_START, Math.min(DATA_END, Number(year) || DATA_START));
  const position = ((bounded - DATA_START) / (DATA_END - DATA_START)) * (series.length - 1);
  const index = Math.floor(position);
  const next = Math.min(index + 1, series.length - 1);
  const t = position - index;
  return series[index].value + (series[next].value - series[index].value) * t;
}

export const ALL_SERIES = [...MARKETS, ...PORTFOLIOS];
