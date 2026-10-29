(() => {
'use strict';
const U=()=>window.IMEFUtils;
const option=(val,text,selected)=>`<option value="${U().esc(val)}" ${String(val)===String(selected)?'selected':''}>${U().esc(text)}</option>`;
function filterRows(app){
 const f=app.state.filters;const {clean,getSort,regional}=U();
 const phrase=clean(f.query).trim();
 let rows=app.data.proposals.filter(r=>(!f.theme||r.themeId===f.theme)&&(!f.problem||r.problemId===f.problem)&&(!f.sector||r.sectorId===f.sector)
   &&(!f.band||(f.band==='A'?r.score>=90:f.band==='B'?r.score>=80&&r.score<90:r.score>=67&&r.score<80))
   &&(!f.regional||regional(app.data,r)>=Number(f.regional))
   &&(!f.imef||(f.imef==='available'?Boolean(r.imef):clean(r.imef).includes(clean(f.imef))))
   &&(!phrase||[r.title,r.id,r.theme,r.problem,r.sector,r.indicator,r.imef,r.method].some(v=>clean(v).includes(phrase))));
 rows.sort(getSort(app.data,f.sort));
 return rows;
}
function renderSearch(app){
 const f=app.state.filters,d=app.data,{number,esc,svgIcon}=U();
 const optionsThemes=d.topics;
 const optionProblems=d.problems.filter(p=>!f.theme||d.proposals.some(r=>r.themeId===f.theme&&r.problemId===p.id));
 const optionSectors=d.sectors.filter(s=>d.proposals.some(r=>(!f.theme||r.themeId===f.theme)&&(!f.problem||r.problemId===f.problem)&&r.sectorId===s.id));
 const all=filterRows(app),total=all.length,per=18,pages=Math.max(1,Math.ceil(total/per));
 f.page=Math.min(f.page,pages);
 const visible=all.slice((f.page-1)*per,f.page*per);
 return `<section class="page-entry"><div class="eyebrow">BASE DOCUMENTAL / EXPLORACIÓN LIBRE</div><div class="section-heading"><div><h1>Buscador avanzado<span class="title-period">.</span></h1><p>Consulta los registros exactos de la megabase. Los filtros se actualizan según las combinaciones aprobadas.</p></div><button class="btn btn-soft" data-action="clearFilters">${svgIcon('filter',17)} Limpiar filtros</button></div>
 <div class="filter-card"><label class="search-wrapper"><span>${svgIcon('search',21)}</span><input id="keyword-search" data-control="query" type="search" value="${esc(f.query)}" placeholder="Busca un tema, folio, indicador o palabra clave…" autocomplete="off" /></label>
 <div class="filters-grid"><label>Tema<select data-control="theme"><option value="">Todos los temas</option>${optionsThemes.map(v=>option(v.id,v.name,f.theme)).join('')}</select></label>
 <label>Problema<select data-control="problem"><option value="">Todos los problemas</option>${optionProblems.map(v=>option(v.id,v.name,f.problem)).join('')}</select></label>
 <label>Sector<select data-control="sector"><option value="">Todos los sectores</option>${optionSectors.map(v=>option(v.id,v.name,f.sector)).join('')}</select></label>
 <label>Prioridad<select data-control="band">${[['','Todas las prioridades'],['A','A · Muy alta (≥90)'],['B','B · Alta (80–89)'],['C','C · Viable (67–79)']].map(([v,t])=>option(v,t,f.band)).join('')}</select></label>
 <label>Pertinencia territorial<select data-control="regional">${[['','Todos los niveles'],['100','Mayor peso base (100)'],['83','Alta (≥83)'],['67','Media o superior (≥67)']].map(([v,t])=>option(v,t,f.regional)).join('')}</select></label>
 <label>Aporte potencial IMEF<select data-control="imef"><option value="">Todos los enfoques</option><option value="available" ${f.imef==='available'?'selected':''}>Con aporte descrito</option>${[...new Set(d.proposals.map(r=>r.imef))].sort().map(v=>option(v,v,f.imef)).join('')}</select></label></div></div>
 <div class="results-toolbar"><div><strong>${number(total)} resultados</strong><span> · ${number(d.proposals.length)} investigaciones aprobadas en la base</span></div><label>Ordenar por <select data-control="sort">${[['score','Mayor índice original'],['coherence','Mejor coherencia'],['regional','Mayor pertinencia territorial'],['university','Enfoque universidad*'],['imef','Enfoque IMEF*'],['low','Menor índice'],['az','Título A–Z']].map(([v,t])=>option(v,t,f.sort)).join('')}</select></label></div>
 <div class="result-list">${visible.length?visible.map(r=>app.projectCard(r,'list')).join(''):`<div class="empty-state"><div class="empty-icon">⌕</div><h3>No hay investigaciones con esos filtros</h3><p>Prueba con otra palabra o elimina uno de los filtros. Solo se muestran cruces aprobados.</p><button data-action="clearFilters" class="btn btn-primary">Restablecer búsqueda</button></div>`}</div>
 ${pages>1?`<div class="pagination"><button class="btn btn-outline btn-sm" data-action="searchPage" data-page="${f.page-1}" ${f.page===1?'disabled':''}>← Anterior</button><span>Página ${f.page} de ${number(pages)}</span><button class="btn btn-outline btn-sm" data-action="searchPage" data-page="${f.page+1}" ${f.page===pages?'disabled':''}>Siguiente →</button></div>`:''}
 <p class="caption-text">*Los enfoques universidad e IMEF favorecen registros con información metodológica o aportación descrita; en caso de empate utilizan el índice original. No existen puntuaciones institucionales independientes en el Excel.</p></section>`;
}
window.IMEFFilters={filterRows,renderSearch,option};
})();
