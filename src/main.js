import './style.css';
import { MARKETS, PORTFOLIOS, getSeries, DATA_NOTE } from './data.js';

const icon = (name) => {
  const shapes = {
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/>',
    play: '<path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    reset: '<path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/>',
    expand: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
    arrow: '<path d="m5 16 5-5 4 3 5-7M14 7h5v5"/>',
    wallet: '<path d="M4 6h14v3M4 6V4h14M4 6v14h16V9H4m11 4h5v4h-5Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    shield: '<path d="m12 3 8 3v7c0 4-8 8-8 8s-8-4-8-8V6ZM8 12l3 3 5-6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name] || ''}</svg>`;
};

const history = [
  { year: 2011.76, label: '2011', title: '欧债危机蔓延', sub: '欧洲市场承压', date: '2011.10.04', detail: '2011.07.01 — 2011.10.04，欧债危机蔓延，欧洲市场承压，法国 CAC40 出现明显回撤。', color: '#98a3bc' },
  { year: 2013.39, label: '2013', title: '安倍经济学', sub: '日本市场复苏', date: '2013.05.22', detail: '2012.11.13 — 2013.05.22，货币与财政政策推动市场复苏，日本股票市场明显走强。', color: '#a2dfc8' },
  { year: 2015.43, label: '2015', title: 'A股杠杆牛市', sub: '繁荣与波动并存', date: '2015.06.08', detail: '2014.11.20 — 2015.06.08，A股杠杆牛市，沪深300快速上涨，随后市场经历大幅调整。', color: '#ef8589' },
  { year: 2020.23, label: '2020', title: '全球疫情冲击', sub: '市场同步回撤', date: '2020.03.23', detail: '2020.02.19 — 2020.03.23，新冠疫情引发全球市场抛售，欧洲与全球股票市场同步大幅回撤。', color: '#edbc73' },
  { year: 2022.78, label: '2022', title: '激进加息周期', sub: '增长资产重新定价', date: '2022.10.13', detail: '2022.01.03 — 2022.10.13，四十年来最激进的加息周期，科技股估值与增长资产承受压力。', color: '#b99afa' },
  { year: 2024.52, label: '2024', title: 'AI 浪潮', sub: '科技驱动新增长', date: '2024.07.10', detail: '2022.12.30 — 2024.07.10，AI浪潮推动科技股，纳指100与全球科技市场明显走强。', color: '#b99afa' },
  { year: 2025.27, label: '2025', title: '关税冲击', sub: '全球贸易的不确定性', date: '2025.04.08', detail: '2025.02.19 — 2025.04.08，“对等关税”冲击全球市场，市场面对全球贸易政策的不确定性。', color: '#ef8589' },
];

const series = Object.fromEntries([...MARKETS, ...PORTFOLIOS].map(m => [m.id, getSeries(m.id)]));
const count = series.nasdaq.length;
const state = { mode: 'markets', panel: 'allocation', index: count - 1, playing: false, speed: 1, hidden: new Set(), selectedEvent: null };
const money = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
const pct = n => `${n > -.05 ? '+' : '−'}${Math.abs(n).toFixed(1)}%`;
const optimal = PORTFOLIOS.find(p => p.id === 'optimal');
const equal = PORTFOLIOS.find(p => p.id === 'equal');

document.querySelector('#app').innerHTML = `
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Market Atlas 首页"><span class="brand-icon">${icon('globe')}</span><div><div class="brand-name">MARKET ATLAS</div><div class="brand-sub">A WORLD OF COMPOUND GROWTH</div></div></a>
      <nav class="toplinks" aria-label="主导航"><button class="active" id="nav-markets">全球定投</button><button id="nav-portfolio">组合洞察</button><button id="methodology">回测说明 ${icon('info')}</button></nav>
      <div class="top-meta"><i class="live-dot"></i> 数据截至 2026.10.08 <span style="color:#394256">/</span> 视觉演示</div>
    </header>
    <main>
      <section class="hero">
        <div><div class="eyebrow">SIX MARKETS. ONE JOURNEY.</div><h1>把世界的增长，<span>交给时间。</span></h1><p>每月 ¥3,000，跨越六大市场。让十六年的起伏，回答长期投资的意义。</p></div>
        <div class="period-label"><small>THE INVESTMENT JOURNEY</small><strong>2010.01<span>—</span>2026.10</strong></div>
      </section>
      <section class="workspace" aria-label="全球市场可视化">
        <div class="stage" id="stage">
          <div class="stage-toolbar"><div class="tabs" role="group" aria-label="曲线视图"><button class="active" id="tab-markets" aria-pressed="true">六大市场</button><button id="tab-portfolio" aria-pressed="false">组合对比</button></div><div class="toolbar-right"><span class="toolbar-label"><i></i> 累计定投收益率</span><button class="icon-btn" id="export" title="导出当前图表" aria-label="导出当前图表">${icon('download')}</button><button class="icon-btn" id="fullscreen" title="全屏查看" aria-label="全屏查看">${icon('expand')}</button></div></div>
          <div class="chart-area" id="chart-area"><div class="chart-top"><small>投资旅程 · 第 <span id="period-number">202</span> 期</small><div class="chart-date" id="chart-date">2026.10.08</div><div class="chart-capital">累计投入 <b id="chart-capital">¥606,000</b></div></div><div class="chart-caption">GLOBAL MARKETS / CNY</div><svg class="chart-svg" id="chart" viewBox="0 0 950 385" preserveAspectRatio="none" role="img" aria-label="六大市场累计定投收益率图"></svg><div class="chart-tooltip" id="tooltip"></div></div>
          <div class="chart-legend" id="legend"></div>
          <div class="timeline"><button class="play-btn" id="play" aria-label="播放投资旅程">${icon('play')}</button><div class="slider-wrap"><input class="slider" id="timeline" type="range" min="0" max="${count - 1}" value="${count - 1}" aria-label="投资旅程时间轴" style="--progress:100%"/><div class="timeline-labels"><span>2010</span><span>2014</span><span>2018</span><span>2022</span><span>2026</span></div></div><div class="playback-controls"><button class="speed-btn" id="speed" aria-label="播放速度 1 倍">1×</button><button class="icon-btn" id="replay" aria-label="从头重播" title="从头重播">${icon('reset')}</button></div></div>
        </div>
        <aside class="side-panel"><div class="globe-frame"><canvas id="globe" aria-label="全球六大市场点阵地球" role="img"></canvas><div class="globe-label">CONNECTED WORLD</div><div class="globe-coordinate">31.23° N &nbsp; 121.47° E</div><div class="globe-badge">6 MARKETS · 3 CONTINENTS</div></div><div class="allocation"><div class="panel-heading"><h2 id="panel-title">每月定投配置</h2><span>OPTIMAL MIX</span></div><p class="panel-desc" id="panel-desc">视频最优方案 · 按每月新增资金分配</p><div class="stack-bar" id="stack-bar"></div><div class="market-list" id="market-list"></div><div class="panel-foot"><span id="panel-foot-label">每月投入</span><b id="panel-foot-value">¥3,000</b></div></div></aside>
      </section>
      <section class="metrics" aria-label="视频期末回测结果">
        <article class="metric highlight"><div class="metric-label">最优组合 · 期末市值 ${icon('wallet')}</div><div class="metric-value">275.60<small>万元</small></div><div class="metric-note">累计投入 <span style="color:#adb6c6">60.60 万元</span></div></article>
        <article class="metric"><div class="metric-label">期末累计收益率 ${icon('arrow')}</div><div class="metric-value">+354.8<small>%</small></div><div class="metric-note"><span class="positive">+133.0 个百分点</span><span>相较等权配置</span></div></article>
        <article class="metric"><div class="metric-label">视频期末 · 年化 IRR ${icon('clock')}</div><div class="metric-value">16.21<small>%</small></div><div class="metric-note">202 期定投 <span style="color:#445169">/</span> 16 年复利积累</div></article>
        <article class="metric"><div class="metric-label">视频全期 · 最大回撤 ${icon('shield')}</div><div class="metric-value">−28.0<small>%</small></div><div class="metric-note">在波动中，寻找增长的平衡</div></article>
      </section>
      <section class="story-section"><div class="section-header"><h2>时间里的转折 <span>MOMENTS THAT MATTER</span></h2><small>点击事件，回到那个时刻 ↗</small></div><div class="events" id="events">${history.map((e,i) => `<button class="event-card" data-event="${i}" aria-label="查看${e.label}年${e.title}"><div class="event-year"><i></i>${e.label}</div><div class="event-title">${e.title}</div><div class="event-sub">${e.sub}</div></button>`).join('')}</div></section>
    </main>
    <footer class="footer"><span>曲线按视频关键节点重建，仅作视觉演示；期末统计引用原视频。人民币计价，分红再投资，未计手续费、税费与换汇成本。</span><span>CHOOSE THE MIX. GIVE IT TIME.</span></footer>
  </div>
  <div class="toast" id="toast" role="status"></div>
  <div class="modal-backdrop" id="modal" hidden><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-top"><h2 id="modal-title">回测说明</h2><button class="icon-btn" id="modal-close" aria-label="关闭说明">${icon('close')}</button></div><div id="modal-content"></div></section></div>
`;

const $ = selector => document.querySelector(selector);
const dateAt = index => {
  if (index === count - 1) return '2026.10.08';
  const date = new Date(Date.UTC(2010, 0, 1) + index / (count - 1) * (Date.UTC(2026, 9, 8) - Date.UTC(2010, 0, 1)));
  return `${date.getUTCFullYear()}.${String(date.getUTCMonth()+1).padStart(2,'0')}.${String(date.getUTCDate()).padStart(2,'0')}`;
};
const activeItems = () => state.mode === 'markets' ? MARKETS : [optimal, equal];
const visibleItems = () => activeItems().filter(m => !state.hidden.has(m.id));
const valueAt = (id, index=state.index) => series[id][index].value;
const yearAt = index => series.nasdaq[index].year;
let chartGeometry = { W: 950, H: 385, left: 50, right: 111, top: 68, bottom: 41 };

function renderChart() {
  const rect=$('#chart').getBoundingClientRect();
  const W = Math.max(320,rect.width), H = rect.height || 385, mobile=W<540;
  const left = mobile?40:50, right = mobile?61:111, top = mobile?111:68, bottom = 41;
  chartGeometry={W,H,left,right,top,bottom};
  $('#chart').setAttribute('viewBox',`0 0 ${W} ${H}`);
  const plotW = W-left-right, plotH = H-top-bottom;
  const max = state.mode === 'markets' ? 650 : 400;
  const min = -50;
  const x = index => left + index/(count-1)*plotW;
  const y = value => top + (max-value)/(max-min)*plotH;
  const items = visibleItems();
  const ticks = state.mode === 'markets' ? [0,100,200,300,400,500,600] : [0,100,200,300,400];
  let svg = `<defs><filter id="glow" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="3"/></filter><linearGradient id="gold-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e9c887" stop-opacity=".17"/><stop offset="100%" stop-color="#e9c887" stop-opacity="0"/></linearGradient><linearGradient id="purple-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b99afa" stop-opacity=".08"/><stop offset="100%" stop-color="#b99afa" stop-opacity="0"/></linearGradient><clipPath id="plot-clip"><rect x="${left-4}" y="${top-10}" width="${plotW+8}" height="${plotH+22}"/></clipPath></defs>`;
  ticks.forEach(v => svg += `<line x1="${left}" y1="${y(v)}" x2="${W-right+8}" y2="${y(v)}" stroke="#697896" stroke-opacity="${v === 0 ? .23 : .10}" ${v===0?'':'stroke-dasharray="3 5"'}/><text x="${left-8}" y="${y(v)+3}" fill="#546177" text-anchor="end" font-family="Manrope, sans-serif" font-size="9">${v===0?'0':`+${v}`} %</text>`);
  [2010,2012,2014,2016,2018,2020,2022,2024,2026].forEach(yr => {
    const cx = left+(yr-2010)/(yearAt(count-1)-2010)*plotW;
    svg += `<line x1="${cx}" y1="${top+15}" x2="${cx}" y2="${H-bottom}" stroke="#71809a" stroke-opacity=".065"/><text x="${cx}" y="${H-15}" fill="#657187" text-anchor="middle" font-family="Manrope, sans-serif" font-size="9">${yr}</text>`;
  });
  if (state.selectedEvent !== null) {
    const e = history[state.selectedEvent];
    const ex = left+(e.year-2010)/(yearAt(count-1)-2010)*plotW;
    svg += `<line x1="${ex}" y1="${top+15}" x2="${ex}" y2="${H-bottom}" stroke="${e.color}" stroke-opacity=".35" stroke-dasharray="3 4"/><circle cx="${ex}" cy="${H-bottom+3}" r="3" fill="${e.color}"/>`;
  }
  const endpointLabels = items.map(m => ({m,y:y(valueAt(m.id))})).sort((a,b)=>a.y-b.y);
  for(let i=1;i<endpointLabels.length;i++) endpointLabels[i].y = Math.max(endpointLabels[i].y,endpointLabels[i-1].y+15);
  for (const m of items.slice().reverse()) {
    const points = series[m.id].slice(0,state.index+1);
    const path = points.map((p,i)=>`${i===0?'M':'L'}${x(i).toFixed(2)},${y(p.value).toFixed(2)}`).join(' ');
    if(m.id==='optimal' || (state.mode==='markets'&&m.id==='nasdaq')) svg += `<path d="${path} L${x(state.index)},${y(0)} L${left},${y(0)} Z" fill="url(#${m.id==='optimal'?'gold':'purple'}-fill)" clip-path="url(#plot-clip)"/>`;
    svg += `<path d="${path}" fill="none" stroke="${m.color}" stroke-width="6" opacity=".16" filter="url(#glow)" clip-path="url(#plot-clip)"/><path d="${path}" fill="none" stroke="${m.color}" stroke-width="${m.id==='optimal'?2.8:1.7}" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot-clip)"/>`;
    const ex=x(state.index), ey=y(valueAt(m.id));
    svg += `<circle cx="${ex}" cy="${ey}" r="7" fill="${m.color}" opacity=".28" filter="url(#glow)"/><circle cx="${ex}" cy="${ey}" r="2.8" fill="${m.color}"/>`;
    if(state.index>4) {
      const ly=endpointLabels.find(l=>l.m.id===m.id).y;
      const label=mobile?'':state.mode==='markets'?m.shortName:m.shortName;
      svg += `<text x="${Math.min(ex+8,W-(mobile?58:107))}" y="${ly+3}" fill="${m.color}" font-family="DM Sans, Noto Sans SC, sans-serif" font-size="9">${label} ${pct(valueAt(m.id))}</text>`;
    }
  }
  if(state.index<count-1) svg += `<line x1="${x(state.index)}" y1="${top+20}" x2="${x(state.index)}" y2="${H-bottom}" stroke="#e9c887" opacity=".12" stroke-dasharray="2 4"/>`;
  svg += `<rect x="${left}" y="${top}" width="${plotW}" height="${plotH}" fill="transparent" id="chart-hit"/>`;
  $('#chart').innerHTML=svg;
  $('#chart').setAttribute('aria-label',`${state.mode==='markets'?'六大市场':'最优与等权组合'}累计定投收益率，截至${dateAt(state.index)}。历史路径为演示重建。`);
}

function renderLegend(){
  $('#legend').innerHTML=activeItems().map(m=>`<button class="legend-btn ${state.hidden.has(m.id)?'off':''}" data-market="${m.id}" style="--series-color:${m.color}" aria-pressed="${!state.hidden.has(m.id)}"><i></i>${m.name}</button>`).join('');
  $('#legend').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.market;
    if(state.hidden.has(id)) state.hidden.delete(id);
    else if(visibleItems().length>1) state.hidden.add(id);
    else {toast('至少保留一条曲线');return;}
    renderLegend();renderChart();
  }));
}

function renderPanel(){
  if(!$('#panel-toggle')) {
    const toggle=document.createElement('button');toggle.id='panel-toggle';toggle.className='panel-toggle';toggle.textContent='查看排行 ↗';toggle.setAttribute('aria-label','切换市场排行与配置');
    $('.panel-heading span').replaceWith(toggle);
    toggle.addEventListener('click',()=>{state.panel=state.panel==='allocation'?'ranking':'allocation';renderPanel();});
  }
  $('#panel-toggle').hidden=state.mode==='portfolio';
  $('#panel-toggle').textContent=state.panel==='allocation'?'查看排行 ↗':'定投配置 ↗';
  if(state.mode==='portfolio') {
    $('#panel-title').textContent='组合表现对比';
    $('#panel-desc').textContent='相同投入 · 不同配置 · 当前演示时点';
    $('#stack-bar').innerHTML=MARKETS.map(m=>`<span style="width:${m.monthly/3000*100}%;background:${m.color}"></span>`).join('');
    const periods=Math.max(1,Math.round(1+state.index/(count-1)*201));
    const principal=periods*3000;
    $('#market-list').innerHTML=[optimal,equal].map(m=>`<div class="market-row"><i style="background:${m.color}"></i><span class="name">${m.name}</span><span class="percent" style="color:${m.color}">${pct(valueAt(m.id))}</span><span class="allocation-sub">${state.index===count-1?'期末':'演示'}市值 ¥${money(state.index===count-1?m.endingValue:principal*(1+valueAt(m.id)/100))}</span></div>`).join('')+`<div style="margin-top:8px;padding:14px 0 0;border-top:1px solid var(--border)"><div style="font-size:9px;color:#7d889c;margin-bottom:10px">视频期末 · 配置带来的差异</div><div style="font:500 26px Manrope,sans-serif;color:#e9c887">+80.6 <span style="font-size:10px;color:#8c96a7">万元</span></div><p style="font-size:9px;color:#606e83;line-height:1.8;margin-bottom:0">同样的投入，让分配比例成为<br/>长期增长的一部分。</p></div>`;
    $('#panel-foot-label').textContent='最优组合年化 IRR';
    $('#panel-foot-value').textContent='16.21%';
  } else if(state.panel==='ranking') {
    $('#panel-title').textContent='市场实时排行';
    $('#panel-desc').textContent='当前演示时点 · 按累计定投收益排序';
    $('#stack-bar').innerHTML=MARKETS.map(m=>`<span style="width:${m.monthly/3000*100}%;background:${m.color}"></span>`).join('');
    $('#market-list').innerHTML=MARKETS.slice().sort((a,b)=>valueAt(b.id)-valueAt(a.id)).map((m,i)=>`<div class="market-row"><i style="background:${m.color}"></i><span class="name">${m.name}</span><span class="percent" style="color:${m.color}">${pct(valueAt(m.id))}</span><span class="allocation-sub">0${i+1} · ${m.region}</span></div>`).join('');
    $('#panel-foot-label').textContent='排名时点';
    $('#panel-foot-value').textContent=dateAt(state.index);
  } else {
    $('#panel-title').textContent='每月定投配置';
    $('#panel-desc').textContent='视频最优方案 · 按每月新增资金分配';
    $('#stack-bar').innerHTML=MARKETS.map(m=>`<span style="width:${m.monthly/3000*100}%;background:${m.color}"></span>`).join('');
    $('#market-list').innerHTML=MARKETS.map(m=>`<div class="market-row"><i style="background:${m.color}"></i><span class="name">${m.name}</span><span class="percent">${(m.monthly/3000*100).toFixed(1)}%</span><span class="allocation-sub">¥${money(m.monthly)} / 月</span></div>`).join('');
    $('#panel-foot-label').textContent='每月投入';
    $('#panel-foot-value').textContent='¥3,000';
  }
}

function renderTime(){
  const periods=Math.max(1,Math.round(1+state.index/(count-1)*201));
  $('#period-number').textContent=periods;
  $('#chart-date').textContent=state.selectedEvent===null?dateAt(state.index):history[state.selectedEvent].date;
  $('#chart-capital').textContent=`¥${money(periods*3000)}`;
  $('#timeline').value=state.index;
  $('#timeline').style.setProperty('--progress',`${state.index/(count-1)*100}%`);
  $('#timeline').setAttribute('aria-valuetext',dateAt(state.index));
  renderChart();
  if(state.mode==='portfolio'||state.panel==='ranking') renderPanel();
}

function setMode(mode){
  state.mode=mode;state.hidden.clear();hideTooltip();
  ['markets','portfolio'].forEach(m=>{
    $(`#tab-${m}`).classList.toggle('active',mode===m);
    $(`#tab-${m}`).setAttribute('aria-pressed',String(mode===m));
    $(`#nav-${m}`).classList.toggle('active',mode===m);
  });
  renderLegend();renderPanel();renderChart();
}

function setPlaying(playing){
  state.playing=playing;
  $('#play').innerHTML=icon(playing?'pause':'play');
  $('#play').setAttribute('aria-label',playing?'暂停投资旅程':'播放投资旅程');
}

function clearEvent(){state.selectedEvent=null;document.querySelectorAll('.event-card').forEach(b=>b.classList.remove('current'));}

$('#tab-markets').addEventListener('click',()=>setMode('markets'));
$('#nav-markets').addEventListener('click',()=>setMode('markets'));
$('.brand').addEventListener('click',e=>{e.preventDefault();setMode('markets');state.index=count-1;setPlaying(false);clearEvent();renderTime();});
$('#tab-portfolio').addEventListener('click',()=>setMode('portfolio'));
$('#nav-portfolio').addEventListener('click',()=>setMode('portfolio'));
$('#play').addEventListener('click',()=>{if(!state.playing&&state.index===count-1){state.index=0;clearEvent();renderTime();}setPlaying(!state.playing);hideTooltip();});
$('#replay').addEventListener('click',()=>{state.index=0;clearEvent();renderTime();setPlaying(true);});
$('#timeline').addEventListener('input',e=>{state.index=Number(e.target.value);setPlaying(false);clearEvent();hideTooltip();renderTime();});
$('#speed').addEventListener('click',()=>{state.speed=state.speed===1?2:state.speed===2?4:1;$('#speed').textContent=`${state.speed}×`;$('#speed').setAttribute('aria-label',`播放速度 ${state.speed} 倍`);});
function expandedMode(expanded){
  $('#stage').classList.toggle('expanded',expanded);
  document.body.style.overflow=expanded?'hidden':'';
  $('#fullscreen').setAttribute('aria-label',expanded?'退出全屏':'全屏查看');
  $('#fullscreen').title=expanded?'退出全屏':'全屏查看';
  hideTooltip();
}
$('#fullscreen').addEventListener('click',async()=>{
  if($('#stage').classList.contains('expanded')){expandedMode(false);return;}
  if(document.fullscreenElement){await document.exitFullscreen();return;}
  try{await $('#stage').requestFullscreen();if(!document.fullscreenElement)expandedMode(true);}catch{expandedMode(true);}
});
document.addEventListener('fullscreenchange',()=>{
  const expanded=Boolean(document.fullscreenElement);
  $('#fullscreen').setAttribute('aria-label',expanded?'退出全屏':'全屏查看');
  $('#fullscreen').title=expanded?'退出全屏':'全屏查看';
});
document.querySelectorAll('.event-card').forEach(button=>button.addEventListener('click',()=>{
  state.selectedEvent=Number(button.dataset.event);
  const e=history[state.selectedEvent];
  state.index=series.nasdaq.reduce((best,p,i)=>Math.abs(p.year-e.year)<Math.abs(series.nasdaq[best].year-e.year)?i:best,0);
  setPlaying(false);hideTooltip();
  document.querySelectorAll('.event-card').forEach(b=>b.classList.toggle('current',b===button));
  renderTime();
  showModal(e.title,`<p>${e.detail}</p><dl><dt>时点</dt><dd>${e.date}</dd><dt>图表定位</dt><dd>已定位到该事件附近。关闭此面板后，可沿时间轴继续探索。</dd></dl><div class="modal-note">事件日期与背景来自视频；图表历史路径按关键节点重建，仅作视觉演示。</div>`);
}));

let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
let previousFocus;
function showModal(title,content){previousFocus=document.activeElement;$('#modal-title').textContent=title;$('#modal-content').innerHTML=content;$('#modal').hidden=false;$('#modal-close').focus();}
function closeModal(){$('#modal').hidden=true;previousFocus?.focus();}
$('#modal-close').addEventListener('click',closeModal);
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))closeModal();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&$('#stage').classList.contains('expanded')){expandedMode(false);return;}
  if(!$('#modal').hidden){if(e.key==='Escape')closeModal();if(e.key==='Tab'){e.preventDefault();$('#modal-close').focus();}return;}
  if(e.code==='Space'&&e.target===document.body){e.preventDefault();$('#play').click();}
});
$('#methodology').addEventListener('click',()=>showModal('关于这场定投实验',`<p>以原视频为参考，探索从 <strong>2010年1月到2026年10月8日</strong> 的全球六大指数定投实验。</p><dl><dt>定投方式</dt><dd>每月首个交易日合计投入 ¥3,000，共202期。</dd><dt>六大市场</dt><dd>纳指100、标普500、日经225、沪深300、德国DAX、法国CAC40。</dd><dt>计价与成本</dt><dd>按当日汇率换汇，以人民币计价，ETF分红再投资；未计手续费、税费、换汇成本。</dd><dt>最优配置</dt><dd>原视频以期末收益率最大化求解，组合年化波动不高于等权方案（13.8%），每市场至少5%。</dd><dt>数据来源</dt><dd>期末市值、收益率、IRR与最大回撤引用视频；历史曲线根据关键画面节点生成演示路径。</dd></dl><div class="modal-note">${DATA_NOTE || '历史曲线是视觉演示，不是完整真实行情。'} 配置比例由历史数据事后求解，存在后视偏差，视频结果不代表未来表现。</div>`));

function hideTooltip(){$('#tooltip').classList.remove('visible');}
$('#chart-area').addEventListener('pointerleave',hideTooltip);
$('#chart').addEventListener('pointermove',e=>{
  if(state.playing)return;
  const rect=$('#chart').getBoundingClientRect();
  const {W,left,right}=chartGeometry;
  const sx=(e.clientX-rect.left)/rect.width*W;
  if(sx<left||sx>W-right){hideTooltip();return;}
  const index=Math.max(0,Math.round((sx-left)/(W-left-right)*(count-1)));
  if(index>state.index){hideTooltip();return;}
  const tooltip=$('#tooltip');
  tooltip.innerHTML=`<div class="tooltip-date">${dateAt(index)} <span style="color:#536079">· 演示时点</span></div>${visibleItems().sort((a,b)=>valueAt(b.id,index)-valueAt(a.id,index)).map(m=>`<div class="tooltip-row"><i class="tooltip-dot" style="background:${m.color}"></i>${m.name}<b style="color:${m.color}">${pct(valueAt(m.id,index))}</b></div>`).join('')}`;
  tooltip.classList.add('visible');
  const box=tooltip.getBoundingClientRect();
  tooltip.style.left=`${Math.max(8,Math.min(e.clientX-rect.left+16,rect.width-box.width-10))}px`;
  tooltip.style.top=`${Math.max(108,Math.min(e.clientY-rect.top-box.height/2,rect.height-box.height-12))}px`;
});
$('#export').addEventListener('click',()=>{
  setPlaying(false);hideTooltip();
  const {W,H}=chartGeometry;
  const exportH=H+44,mobile=W<540;
  const svg=$('#chart').cloneNode(true);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width',String(W*2));svg.setAttribute('height',String(exportH*2));svg.setAttribute('viewBox',`0 0 ${W} ${exportH}`);
  const background=document.createElementNS('http://www.w3.org/2000/svg','rect');background.setAttribute('width',String(W));background.setAttribute('height',String(exportH));background.setAttribute('fill','#0e111b');svg.prepend(background);
  const title=document.createElementNS('http://www.w3.org/2000/svg','text');title.setAttribute('x',mobile?'20':'50');title.setAttribute('y','30');title.setAttribute('fill','#e9c887');title.setAttribute('font-size',mobile?'12':'16');title.textContent=`MARKET ATLAS · ${dateAt(state.index)}`;svg.append(title);
  const note=document.createElementNS('http://www.w3.org/2000/svg','text');note.setAttribute('x',mobile?'20':'50');note.setAttribute('y','50');note.setAttribute('fill','#8994ab');note.setAttribute('font-size',mobile?'8':'10');note.textContent=mobile?'按视频关键节点重建 · 历史路径为演示':'按视频关键节点重建的演示曲线 · 期末统计引用原视频';svg.append(note);
  const items=visibleItems(),cols=mobile?3:6;
  items.forEach((m,i)=>{const label=document.createElementNS('http://www.w3.org/2000/svg','text');label.setAttribute('x',String(20+(i%cols)*(W-30)/cols));label.setAttribute('y',String(H+16+Math.floor(i/cols)*15));label.setAttribute('fill',m.color);label.setAttribute('font-size','9');label.textContent=`● ${m.shortName}`;svg.append(label);});
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml;charset=utf-8'}));
  const img=new Image();
  img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=Math.round(W*2);canvas.height=Math.round(exportH*2);canvas.getContext('2d').drawImage(img,0,0);URL.revokeObjectURL(url);canvas.toBlob(blob=>{if(!blob){toast('导出失败，请重试');return;}const downloadUrl=URL.createObjectURL(blob);const a=document.createElement('a');a.href=downloadUrl;a.download=`market-atlas-${dateAt(state.index)}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(downloadUrl),1000);toast('当前图表已导出为 PNG');},'image/png');};
  img.onerror=()=>{URL.revokeObjectURL(url);toast('导出失败，请重试');};img.src=url;
});

// Procedural point globe: local canvas geometry, no bitmap or remote assets.
const canvas=$('#globe'),ctx=canvas.getContext('2d');
const landPolygons=[
  [[-168,68],[-148,72],[-125,70],[-100,80],[-65,60],[-52,47],[-76,25],[-98,16],[-118,30],[-130,50],[-165,58]],
  [[-81,12],[-60,8],[-36,-5],[-42,-25],[-67,-55],[-77,-25]],
  [[-17,36],[15,38],[34,32],[52,11],[34,-23],[19,-35],[7,-27],[-12,4]],
  [[-12,36],[-9,58],[24,71],[60,68],[95,78],[140,69],[175,58],[140,38],[122,8],[105,-5],[83,6],[72,24],[45,29],[33,42],[15,38]],
  [[112,-11],[135,-10],[155,-24],[145,-40],[116,-34]],
  [[-52,60],[-25,70],[-42,84],[-62,81]],
  [[130,31],[140,46],[145,43],[137,33]],
  [[46,-13],[51,-16],[49,-26],[44,-24]],
];
function inPolygon(lon,lat,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>lat)!==(yj>lat))&&(lon<(xj-xi)*(lat-yi)/(yj-yi)+xi))inside=!inside;}return inside;}
const points=[];
for(let lat=-72;lat<84;lat+=2.8){for(let lon=-180;lon<180;lon+=3.1/Math.max(.35,Math.cos(lat*Math.PI/180))){const land=landPolygons.some(p=>inPolygon(lon,lat,p));points.push({lon,lat,land});}}
const cityCoords=[[-74,40.7],[-73,40.7],[139.7,35.7],[121.5,31.2],[8.7,50.1],[2.3,48.9]];
const cityColors=MARKETS.map(m=>m.color);
let globeW=0,globeH=0;
new ResizeObserver(entries=>{const rect=entries[0].contentRect;globeW=rect.width;globeH=rect.height;const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=globeW*dpr;canvas.height=globeH*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}).observe(canvas);
function renderGlobe(time){
  if(!globeW)return;
  ctx.clearRect(0,0,globeW,globeH);
  const cx=globeW*.52,cy=globeH*.53,r=Math.min(globeW*.36,globeH*.44),rotation=.45+time*.000016;
  const project=(lon,lat,radius=r)=>{
    const la=lat*Math.PI/180,lo=lon*Math.PI/180+rotation;
    let px=Math.cos(la)*Math.sin(lo),pz=Math.cos(la)*Math.cos(lo),py=-Math.sin(la);
    const tilt=-.15;const yy=py*Math.cos(tilt)-pz*Math.sin(tilt);const zz=py*Math.sin(tilt)+pz*Math.cos(tilt);
    return {x:cx+px*radius,y:cy+yy*radius,z:zz};
  };
  const halo=ctx.createRadialGradient(cx,cy,r*.7,cx,cy,r*1.45);halo.addColorStop(0,'#6b82dc12');halo.addColorStop(.6,'#4657a516');halo.addColorStop(1,'#5369b000');ctx.fillStyle=halo;ctx.fillRect(0,0,globeW,globeH);
  const shade=ctx.createRadialGradient(cx-r*.3,cy-r*.35,0,cx,cy,r);shade.addColorStop(0,'#1b2445');shade.addColorStop(.7,'#101a30');shade.addColorStop(1,'#0b1424');ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=shade;ctx.fill();ctx.strokeStyle='#6d8bd352';ctx.lineWidth=.7;ctx.stroke();
  for(const p of points){const q=project(p.lon,p.lat);if(q.z<0)continue;ctx.fillStyle=p.land?`rgba(135,166,226,${.14+q.z*.48})`:`rgba(91,121,177,${.04+q.z*.10})`;ctx.beginPath();ctx.arc(q.x,q.y,p.land?.65:.4,0,Math.PI*2);ctx.fill();}
  cityCoords.forEach((city,i)=>{
    const a=cityCoords[3],b=city;
    ctx.beginPath();let started=false;
    for(let step=0;step<=40;step++){const t=step/40;let lonDelta=b[0]-a[0];if(lonDelta>180)lonDelta-=360;if(lonDelta< -180)lonDelta+=360;const q=project(a[0]+lonDelta*t,a[1]+(b[1]-a[1])*t,r*(1+Math.sin(t*Math.PI)*.25));if(q.z<-.08){started=false;continue;}if(!started){ctx.moveTo(q.x,q.y);started=true;}else ctx.lineTo(q.x,q.y);}
    ctx.strokeStyle=cityColors[i]+'6e';ctx.lineWidth=.75;ctx.stroke();
    const p=project(...city);if(p.z>0){ctx.shadowColor=cityColors[i];ctx.shadowBlur=7;ctx.fillStyle=cityColors[i];ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
  });
}

let lastTime=0,playAccumulator=0,lastGlobe=0;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function frame(time){
  const dt=Math.min(100,time-lastTime);lastTime=time;
  if(time-lastGlobe>33){renderGlobe(reduceMotion?0:time);lastGlobe=time;}
  if(state.playing){playAccumulator+=dt*state.speed;const interval=24000/(count-1);if(playAccumulator>=interval){const steps=Math.floor(playAccumulator/interval);playAccumulator%=interval;state.index=Math.min(count-1,state.index+steps);clearEvent();renderTime();if(state.index===count-1)setPlaying(false);}}else playAccumulator=0;
  requestAnimationFrame(frame);
}

new ResizeObserver(()=>renderChart()).observe($('#chart-area'));
$('.toolbar-label').innerHTML='<i></i> 累计收益率 · 演示曲线';
renderLegend();renderPanel();renderTime();requestAnimationFrame(frame);
