(() => {
'use strict';
const U=()=>window.IMEFUtils;
function miniBars(data,record){
 const {bar,coherence,regional}=U();
 return `<div class="score-stack">${bar('Índice de prioridad editorial',record.score,'gold','Valor original del Excel')}${bar('Coherencia temática ponderada',coherence(data,record),'cyan','Derivada de las tres matrices T–P, T–S y P–S')}${bar('Pertinencia territorial orientativa',regional(data,record),'turquoise','Promedio normalizado de relevancia del problema y peso del sector') }</div>`;
}
function breakdown(data,record){
 const {pair}=U(),m=pair(data,record);
 return `<div class="mini-matrix"><div><span>Tema ↔ Problema</span><b>${m.tp??'—'} <small>/ 3</small></b></div><div><span>Tema ↔ Sector</span><b>${m.ts??'—'} <small>/ 3</small></b></div><div><span>Problema ↔ Sector</span><b>${m.ps??'—'} <small>/ 3</small></b></div></div>`;
}
function homeChart(data){
 const total=data.counts.approved;
 const groups=[['A · Muy alta',data.counts.veryHigh,'gold'],['B · Alta',data.counts.high,'cyan'],['C · Viable',total-data.counts.veryHigh-data.counts.high,'turquoise']];
 return `<div class="home-chart">${groups.map(([n,v,c])=>`<div class="chart-group"><div class="chart-label"><span>${n}</span><b>${U().number(v)}</b></div><div class="chart-track"><div class="chart-fill ${c}" style="width:${v/total*100}%"></div></div></div>`).join('')}</div>`;
}
function matrix(data,selected){
 const {esc,number}=U();const rows=data.topics,cols=data.problems;
 const counts=new Map(); for(const r of data.proposals){const k=r.themeId+'|'+r.problemId;counts.set(k,(counts.get(k)||0)+1);}
 return `<div class="matrix-scroll"><table class="matrix-table"><thead><tr><th class="corner">TEMA / PROBLEMA</th>${cols.map(p=>`<th title="${esc(p.name)}">${esc(p.id)}</th>`).join('')}</tr></thead><tbody>${rows.map(t=>`<tr><th title="${esc(t.name)}"><span>${esc(t.id)}</span> ${esc(t.name)}</th>${cols.map(p=>{
  const n=counts.get(t.id+'|'+p.id)||0;const rel=data.matrices.tp[t.id+'|'+p.id];const cls=n===0?'empty':rel===3?'strong':'moderate';
  return `<td><button type="button" class="heat ${cls} ${selected===t.id+'|'+p.id?'selected':''}" title="${esc(t.name)} × ${esc(p.name)}: ${number(n)} aprobadas, relación ${rel??'?'} / 3" data-action="matrixPair" data-t="${t.id}" data-p="${p.id}" aria-label="${esc(t.id)} y ${esc(p.id)}: ${n} aprobadas">${n||'·'}</button></td>`;
 }).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function relations(data,themeId){
 const {esc,number}=U();
 const topic=data.catalog.topics[themeId]||data.topics[0];
 const rows=data.proposals.filter(r=>r.themeId===topic.id);
 const problems=new Map(),sectors=new Map();
 for(const r of rows){problems.set(r.problemId,(problems.get(r.problemId)||0)+1);sectors.set(r.sectorId,(sectors.get(r.sectorId)||0)+1);}
 const ps=[...problems].sort((a,b)=>b[1]-a[1]).slice(0,8);
 const ss=[...sectors].sort((a,b)=>b[1]-a[1]).slice(0,8);
 const w=1060,h=500,yMid=250;
 const point=(x,y)=>`${x},${y}`;
 const lines=[];
 ps.forEach((a,i)=>{const y=44+i*55;lines.push(`<path d="M 190 ${yMid} C 270 ${yMid} 225 ${y} 330 ${y}" stroke="#45b4dc" stroke-opacity=".32" stroke-width="${Math.max(1.6,Math.min(8,a[1]/20))}" fill="none"/>`);});
 const pIndex=new Map(ps.map(([id],i)=>[id,i]));
 const sIndex=new Map(ss.map(([id],i)=>[id,i]));
 rows.filter(r=>pIndex.has(r.problemId)&&sIndex.has(r.sectorId)).sort((a,b)=>b.score-a.score).slice(0,40).forEach(r=>{
   const ya=44+pIndex.get(r.problemId)*55,yb=44+sIndex.get(r.sectorId)*55;
   lines.push(`<path d="M 640 ${ya} C 725 ${ya} 742 ${yb} 840 ${yb}" stroke="#3bc5ad" stroke-opacity=".17" stroke-width="1.65" fill="none"/>`);
 });
 return `<div class="rel-legend"><span><i class="dot cyan"></i> Tema seleccionado</span><span><i class="dot blue"></i> Problemas compatibles</span><span><i class="dot turquoise"></i> Sectores compatibles</span></div><div class="network-wrapper"><div class="network-map">
 <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${lines.join('')}</svg>
 <div class="network-node central"><small>TEMA</small><b>${esc(topic.name)}</b><span>${number(rows.length)} propuestas</span></div>
 <div class="network-column problems"><div class="network-heading">PROBLEMAS</div>${ps.map(([id,n],i)=>`<button type="button" class="network-item" title="Ver investigaciones de este tema y problema" data-action="networkPair" data-t="${topic.id}" data-p="${id}"><small>${id} · ${number(n)} estudios</small><b>${esc(data.catalog.problems[id]?.name)}</b></button>`).join('')}</div>
 <div class="network-column sectors"><div class="network-heading">SECTORES</div>${ss.map(([id,n])=>`<button type="button" class="network-item green" title="Ver investigaciones del sector" data-action="networkSector" data-s="${id}"><small>${id} · ${number(n)} estudios</small><b>${esc(data.catalog.sectors[id]?.name)}</b></button>`).join('')}</div>
 </div></div><p class="caption-text">Las líneas representan relaciones reales de propuestas aprobadas. Se muestran los ocho nodos con más conexiones por columna para facilitar la lectura.</p>`;
}
window.IMEFCharts={miniBars,breakdown,homeChart,matrix,relations};
})();
