(() => {
'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>new Intl.NumberFormat('es-MX').format(n||0);
const clean=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const clamp=(v,a=0,b=100)=>Math.min(b,Math.max(a,v));
function pair(data,r){
  const mx=data.matrices||{};
  const get=(name,key,fallback)=>mx[name]?.[key]??(fallback??null);
  return {tp:get('tp',r.themeId+'|'+r.problemId,r.tp),ts:get('ts',r.themeId+'|'+r.sectorId,r.ts),ps:get('ps',r.problemId+'|'+r.sectorId,r.ps)};
}
function coherence(data,r){
  const {tp,ts,ps}=pair(data,r);
  return [tp,ts,ps].every(Number.isFinite)?Math.round((4*tp+3*ts+3*ps)/30*100):null;
}
function regional(data,r){
  const p=data.catalog.problems[r.problemId]?.relevance;
  const s=data.catalog.sectors[r.sectorId]?.weight;
  return Number.isFinite(p)&&Number.isFinite(s)?Math.round((p+s)/6*100):null;
}
function band(score,approved=true){
  if(!approved)return {label:'Descartada',className:'muted',short:'Descartada'};
  if(score>=90)return {label:'A · Muy alta',className:'excellent',short:'Muy alta'};
  if(score>=80)return {label:'B · Alta',className:'high',short:'Alta'};
  return {label:'C · Viable',className:'medium',short:'Viable'};
}
const bar=(label,score,cls='cyan',hint='')=>`<div class="score-line"><div class="score-line-head"><span>${esc(label)}</span><b>${score===null?'Sin dato':esc(score)+'/100'}</b></div><div class="progress-rail"><div class="progress-fill ${cls}" style="width:${clamp(score||0)}%"></div></div>${hint?`<small>${esc(hint)}</small>`:''}</div>`;
function getSort(data,mode){
  const score=r=>Number(r.score)||0;
  const coher=r=>coherence(data,r)??0;
  const reg=r=>regional(data,r)??0;
  if(mode==='coherence')return (a,b)=>coher(b)-coher(a)||score(b)-score(a)||a.id.localeCompare(b.id);
  if(mode==='regional')return (a,b)=>reg(b)-reg(a)||score(b)-score(a)||a.id.localeCompare(b.id);
  if(mode==='university')return (a,b)=>(Boolean(b.method&&b.indicator)-Boolean(a.method&&a.indicator))||score(b)-score(a)||a.id.localeCompare(b.id);
  if(mode==='imef')return (a,b)=>(Boolean(b.imef)-Boolean(a.imef))||score(b)-score(a)||a.id.localeCompare(b.id);
  if(mode==='low')return (a,b)=>score(a)-score(b)||a.id.localeCompare(b.id);
  if(mode==='az')return (a,b)=>a.title.localeCompare(b.title,'es');
  return (a,b)=>score(b)-score(a)||a.id.localeCompare(b.id);
}
function svgIcon(name,size=20){
 const icons={
  spark:'<path d="m12 3 1.7 6.3L20 11l-6.3 1.7L12 19l-1.7-6.3L4 11l6.3-1.7L12 3Z"/><path d="m19 19 1 3M3 20l2-2"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  layers:'<path d="m12 2 10 6-10 6L2 8l10-6Zm-10 12 10 6 10-6M2 18l10 6 10-6"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  download:'<path d="M12 2v14m-5-5 5 5 5-5M4 18v4h16v-4"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10v.5"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',
  shuffle:'<path d="M3 7h3l12 10h3m-4-4 4 4-4 4M3 17h3l3-3m5-5 4-2h3m-4-4 4 4-4 4"/>',
  close:'<path d="M18 6 6 18M6 6l12 12"/>',
  scale:'<path d="M4 7h16M4 17h16M8 3v18m8-18v18"/>',
  document:'<path d="M6 2h9l5 5v15H6V2Z"/><path d="M15 2v6h5M9 12h8M9 16h8"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
  file:'<path d="M6 2h9l5 5v15H6V2ZM15 2v5h5"/>',
  bulb:'<path d="M9 18h6m-5 4h4M12 2a7 7 0 0 1 4 13c-1 .8-1.5 1.5-1.5 3h-5c0-1.5-.5-2.2-1.5-3A7 7 0 0 1 12 2Z"/>'};
 return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name]||icons.spark}</svg>`;
}
window.IMEFUtils={esc,number,clean,clamp,pair,coherence,regional,band,bar,getSort,svgIcon};
})();
