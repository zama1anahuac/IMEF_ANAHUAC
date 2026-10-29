(() => {
'use strict';
const U=()=>window.IMEFUtils;
const C=()=>window.IMEFCharts;
const E=()=>window.IMEFExplorer;
const F=()=>window.IMEFFilters;
const main=document.getElementById('main');
const app={
 data:null,
 state:{view:'home',previous:'home',detailId:'',favorites:window.IMEFFavorites.load(),compare:[],explore:{step:1,theme:'',problem:'',order:'coherence'},filters:{query:'',theme:'',problem:'',sector:'',band:'',regional:'',imef:'',sort:'score',page:1},rank:{mode:'high',limit:10,sort:'score',reason:'',page:1},relevance:{perspective:'regional',theme:'',sector:'',limit:25},matrixPair:'',networkTheme:'T01',sectors:{sector:'',problem:''}},
 projectCard,render,openProject,navigate
};
let toastTimer;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4000);}
function navigate(view,opts={}){
 if(view==='detail') return;
 app.state.view=view;
 if(view==='explore'&&opts.reset)app.state.explore={step:1,theme:'',problem:'',order:'coherence'};
 if(view==='rankings'&&opts.mode){app.state.rank.mode=opts.mode;app.state.rank.limit=10;app.state.rank.sort=opts.mode==='low'?'low':'score';app.state.rank.page=1;}
 if(view==='sectors'&&opts.reset)app.state.sectors={sector:'',problem:''};
 render();main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});closeMobile();
}
function openProject(id){if(!app.data.proposals.some(r=>r.id===id))return toast('Esta investigación no aparece en la base cargada.');
 if(app.state.view!=='detail')app.state.previous=app.state.view;
 app.state.detailId=id;app.state.view='detail';render();window.scrollTo({top:0,behavior:'instant'});closeMobile();}
function setFilters(values){Object.assign(app.state.filters,values,{page:1});navigate('search');}
function projectCard(r,variant='list'){
 const {esc,coherence,regional,band,svgIcon}=U();const b=band(r.score);const f=app.state.favorites.has(r.id),c=app.state.compare.includes(r.id);
 return `<article class="project-card ${variant==='compact'?'compact':''}"><div class="project-card-meta"><span class="folio">${esc(r.id)}</span><span class="status-chip ${b.className}">${esc(b.label)}</span>${r.featured?`<span class="featured-pill">★ Destacada</span>`:''}</div>
 <button class="project-title" data-action="openProject" data-id="${r.id}">${esc(r.title)}</button><div class="project-meta-details"><span>${esc(r.theme)}</span><span>${esc(r.problem)}</span><span>${esc(r.sector)}</span></div>
 <div class="project-footer"><div class="project-score-box"><strong>${r.score}<small>/100</small></strong><span>Índice</span></div><div class="project-smallscore"><strong>${coherence(app.data,r)??'—'}<small>/100</small></strong><span>Coherencia</span></div><div class="project-smallscore hide-small"><strong>${regional(app.data,r)??'—'}<small>/100</small></strong><span>Peso regional*</span></div><div class="project-btns"><button class="icon-btn ${f?'saved':''}" data-action="toggleFavorite" data-id="${r.id}" title="${f?'Quitar favorito':'Guardar favorito'}" aria-label="Guardar favorito">${svgIcon('heart',19)}</button><button class="icon-btn ${c?'saved':''}" data-action="toggleCompare" data-id="${r.id}" title="${c?'Quitar de comparación':'Agregar a comparación'}" aria-label="Comparar">${svgIcon('scale',19)}</button><button class="btn btn-primary btn-sm" data-action="openProject" data-id="${r.id}">Ver ficha ${svgIcon('arrow',15)}</button></div></div></article>`;
}
function heroSvg(){return `<svg class="hero-art" viewBox="0 0 680 560" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="orb" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#57B1FF" stop-opacity=".8"/><stop offset="1" stop-color="#38E6BF" stop-opacity=".5"/></linearGradient><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#59E7D5"/><stop offset="1" stop-color="#348BC5" stop-opacity=".1"/></linearGradient></defs><circle cx="360" cy="270" r="218" stroke="#81B8F1" stroke-opacity=".12"/><circle cx="360" cy="270" r="161" stroke="#81B8F1" stroke-opacity=".14" stroke-dasharray="5 9"/><circle cx="360" cy="270" r="102" stroke="#81B8F1" stroke-opacity=".18"/><path d="M136 342 221 278 297 304 387 174 462 217 548 103" stroke="url(#orb)" stroke-width="4" stroke-linecap="round"/><path d="m136 342 85-64 76 26 90-130 75 43 86-114v285H136V342Z" fill="url(#barGradient)" opacity=".25"/><g stroke="#63BBDA" stroke-opacity=".2"><path d="M110 400h465M110 335h465M110 270h465M110 205h465M110 140h465"/><path d="M180 117v310M250 117v310M320 117v310M390 117v310M460 117v310M530 117v310"/></g><g fill="#0C2C4D" stroke="#84E9DA" stroke-width="2"><circle cx="136" cy="342" r="7"/><circle cx="221" cy="278" r="7"/><circle cx="297" cy="304" r="7"/><circle cx="387" cy="174" r="9"/><circle cx="462" cy="217" r="7"/><circle cx="548" cy="103" r="9"/></g><g transform="translate(198 52)"><rect width="157" height="63" rx="12" fill="#143656" stroke="#3A7E9A"/><text x="16" y="22" font-family="Arial" font-size="11" fill="#B5C9E1">INVESTIGACIONES</text><text x="16" y="49" font-size="28" font-weight="700" font-family="Arial" fill="#F7FAFF">5,270</text><circle cx="135" cy="32" r="10" fill="#30D6BD" opacity=".18"/><path d="m130 33 4 4 7-8" stroke="#30D6BD" stroke-width="2"/></g><g transform="translate(420 356)"><rect width="190" height="78" rx="12" fill="#133554" stroke="#417B98"/><text x="14" y="25" font-size="11" font-family="Arial" fill="#BCCFE5">CRITERIO EDITORIAL</text><rect x="14" y="42" width="158" height="9" rx="4.5" fill="#274A63"/><rect x="14" y="42" width="124" height="9" rx="4.5" fill="#43D5BD"/><text x="146" y="69" font-family="Arial" font-weight="700" font-size="12" fill="#E8B85B">ALTA</text></g><circle cx="570" cy="282" r="4" fill="#E8B85B"/><circle cx="115" cy="160" r="4" fill="#4FD6CA"/><circle cx="210" cy="445" r="3" fill="#E8B85B"/></svg>`;}
function renderHome(){
 const d=app.data,{number,esc,svgIcon}=U();const n=d.counts;
 return `<section class="home"><div class="hero"><div class="hero-grain"></div><div class="hero-copy"><div class="hero-kicker"><span class="signal"></span> INVESTIGACIÓN · ECONOMÍA · YUCATÁN</div><h1>De las preguntas<br/>a las <em>posibilidades.</em></h1><p>Explora oportunidades de investigación para el desarrollo económico y empresarial de Yucatán. Conecta temas, problemas y sectores con evidencia documental.</p><div class="hero-actions"><button class="btn btn-mint btn-lg" data-nav="explore">Exploremos ${svgIcon('arrow',18)}</button><button class="btn btn-glass btn-lg" data-action="surprise">${svgIcon('shuffle',19)} Sorpréndeme</button></div><div class="hero-trust"><span>◉ 100% basado en la megabase</span><span>◆ Sin crear cruces no aprobados</span></div></div><div class="hero-visual">${heroSvg()}</div></div>
 <div class="stats-grid"><div class="stat-item"><small>INVESTIGACIONES APROBADAS</small><strong>${number(n.approved)}</strong><span><i class="stat-symbol turquoise"></i> Base principal</span></div><div class="stat-item"><small>TEMAS DE ESTUDIO</small><strong>${number(d.topics.length)}</strong><span><i class="stat-symbol blue"></i> Áreas académicas</span></div><div class="stat-item"><small>PROBLEMAS INVESTIGABLES</small><strong>${number(d.problems.length)}</strong><span><i class="stat-symbol gold"></i> Retos potenciales</span></div><div class="stat-item"><small>SECTORES DE YUCATÁN</small><strong>${number(d.sectors.length)}</strong><span><i class="stat-symbol coral"></i> Poblaciones objetivo</span></div></div>
 <div class="home-section-header"><div><span class="eyebrow">UN UNIVERSO DE POSIBILIDADES</span><h2>¿Por dónde comenzamos?</h2><p>Elige cómo te gustaría descubrir y evaluar oportunidades de investigación.</p></div></div>
 <div class="path-grid"><button class="path-card main-path" data-nav="explore"><div class="path-icon">${svgIcon('layers',26)}</div><span class="path-number">01 / EXPLORADOR</span><h3>Exploremos</h3><p>Elige un tema, un problema compatible y un sector para obtener una ficha completa.</p><span class="path-link">Comenzar recorrido ${svgIcon('arrow',17)}</span></button>
 <button class="path-card" data-action="openRankMode" data-mode="high"><div class="path-icon gold">${svgIcon('spark',26)}</div><span class="path-number">02 / PRIORIZACIÓN</span><h3>Los más viables</h3><p>Descubre los proyectos con los mejores índices y mayor coherencia.</p><span class="path-link">Ver ranking ${svgIcon('arrow',17)}</span></button>
 <button class="path-card" data-nav="search"><div class="path-icon blue">${svgIcon('search',26)}</div><span class="path-number">03 / BASE COMPLETA</span><h3>Explorar toda la base</h3><p>Busca entre miles de títulos por palabras, sector, tema, prioridad o folio.</p><span class="path-link">Abrir buscador ${svgIcon('arrow',17)}</span></button>
 <button class="path-card" data-action="openRankMode" data-mode="low"><div class="path-icon amber">${svgIcon('filter',26)}</div><span class="path-number">04 / ANÁLISIS CRÍTICO</span><h3>Los menos viables</h3><p>Compara las propuestas de menor prioridad con las combinaciones descartadas.</p><span class="path-link">Examinar límites ${svgIcon('arrow',17)}</span></button>
 <button class="path-card" data-action="openRegional"><div class="path-icon purple">${svgIcon('scale',26)}</div><span class="path-number">05 / PERTINENCIA</span><h3>Explorar por relevancia</h3><p>Examina pertinencia territorial y los aportes posibles para universidad e IMEF.</p><span class="path-link">Ver pertinencia ${svgIcon('arrow',17)}</span></button></div>
 <div class="insight-grid"><section class="panel home-insight"><div class="panel-heading"><div><span class="eyebrow small">DISTRIBUCIÓN</span><h2>Prioridad de las propuestas</h2></div><span class="info-tag">Índice original</span></div>${C().homeChart(d)}<div class="insight-footer">Las categorías siguen los umbrales documentados en la hoja METODOLOGIA.<button data-action="openRankMode" data-mode="high" class="text-button">Ver ranking →</button></div></section>
 <section class="panel home-insight concept-insight"><div class="panel-heading"><div><span class="eyebrow small">TRANSPARENCIA</span><h2>La selección también importa</h2></div></div><div class="big-fact"><strong>${number(n.rejected)}</strong><span>combinaciones descartadas</span></div><p>Los cruces excluidos se conservan por separado, con su motivo y relaciones originales; nunca aparecen como proyectos aprobados.</p><button class="btn btn-outline btn-sm" data-action="openRankMode" data-mode="discarded">Analizar descartes ${svgIcon('arrow',15)}</button></section></div>
 <div class="data-source-strip"><div class="source-emblem">↥</div><div><strong>Megabase documental activa</strong><p>${esc(d.name)} · ${number(n.evaluated)} cruces evaluados · ${d.errors.length?'Con avisos de validación':'Estructura validada'}</p></div><button class="btn btn-outline btn-sm" data-action="upload">Actualizar archivo</button></div>
 ${d.errors.length?`<div class="warnings-box"><b>Observaciones de validación</b><p>${d.errors.slice(0,5).map(esc).join(' · ')}</p></div>`:''}
 </section>`;
}
function renderRankings(){
 const d=app.data,r=app.state.rank,{esc,number,band,getSort,svgIcon}=U();const mode=r.mode;
 const original=mode==='discarded'?d.rejected:mode==='low'?d.proposals:d.proposals.filter(v=>v.score>=90);
 const list=[...original].filter(v=>mode!=='discarded'||!r.reason||v.reason===r.reason);
 if(mode==='discarded')list.sort((a,b)=>a.score-b.score||a.id.localeCompare(b.id));
 else list.sort(getSort(d,r.sort));
 const perPage=r.limit==='all'?50:r.limit;
 const pageCount=Math.max(1,Math.ceil(list.length/perPage));
 r.page=Math.min(Math.max(1,r.page||1),pageCount);
 const begin=(r.page-1)*perPage;
 const shown=list.slice(begin,begin+perPage);
 const modeNames={high:'Los más viables',low:'Menor prioridad aprobada',discarded:'Combinaciones descartadas'};
 return `<section class="page-entry"><div class="eyebrow">ANÁLISIS / PRIORIZACIÓN DOCUMENTAL</div><div class="section-heading"><div><h1>Ranking de investigaciones<span class="title-period">.</span></h1><p>Conoce los proyectos preferentes y estudia los límites de los cruces excluidos.</p></div></div><div class="tab-list" role="tablist"><button class="tab ${mode==='high'?'active':''}" data-action="rankMode" data-mode="high">✦ Los más viables</button><button class="tab ${mode==='low'?'active':''}" data-action="rankMode" data-mode="low">↘ Aprobadas de menor prioridad</button><button class="tab ${mode==='discarded'?'active':''}" data-action="rankMode" data-mode="discarded">⊗ Descartadas</button></div>
 <div class="ranking-intro"><div><span class="eyebrow small">${mode==='discarded'?'NO APROBADAS':'BASE APROBADA'}</span><h2>${modeNames[mode]}</h2><p>${mode==='high'?'Puntuación ≥90/100 según la regla editorial. Revisa también las 60 propuestas destacadas del Excel.':mode==='low'?'Combinaciones aprobadas con índice más bajo; siguen cumpliendo los criterios editoriales.':'No forman parte de las 5,270 investigaciones aprobadas. El descarte no implica imposibilidad absoluta.'}</p></div><strong>${number(list.length)} <small>registros</small></strong></div>
 <div class="results-toolbar"><div>Mostrando <b>${number(shown.length?begin+1:0)}–${number(begin+shown.length)}</b> de <b>${number(list.length)}</b></div><div class="toolbar-options">${mode==='discarded'?`<label>Motivo <select data-control="discardReason"><option value="">Todos los motivos</option>${[...new Set(d.rejected.map(v=>v.reason))].sort().map(v=>F().option(v,v,r.reason)).join('')}</select></label>`:`<label>Ordenar <select data-control="rankSort">${[['score','Índice original'],['coherence','Coherencia'],['regional','Relevancia regional'],['university','Universidad*'],['imef','IMEF*'],['low','Menor índice']].map(([v,t])=>F().option(v,t,r.sort)).join('')}</select></label>`}<label>Ver <select data-control="rankLimit">${[['10','Top 10'],['25','Top 25'],['50','Top 50'],['all','Todos']].map(([v,t])=>F().option(v,t,r.limit)).join('')}</select></label></div></div>
 <div class="result-list">${mode==='discarded'?shown.map(v=>`<article class="project-card rejected-card"><div class="project-card-meta"><span class="folio">${esc(v.id)}</span><span class="status-chip muted">Descartada</span><span class="muted-index">Índice ${v.score}/100</span></div><h3>${esc(v.theme)} · ${esc(v.problem)}</h3><p>${esc(v.sector)}</p><div class="rejection-reason"><b>Motivo:</b> ${esc(v.reason)}</div><div class="rejected-footer"><span>Relaciones T–P / T–S / P–S: <b>${v.tp} / ${v.ts} / ${v.ps}</b></span><button class="btn btn-outline btn-sm" data-action="alternatives" data-id="${v.id}">Ver alternativas aprobadas →</button></div></article>`).join(''):shown.map(v=>projectCard(v)).join('')}</div>
 ${pageCount>1?`<div class="pagination"><button class="btn btn-outline btn-sm" data-action="rankPage" data-page="${r.page-1}" ${r.page===1?'disabled':''}>← Anterior</button><span>Página ${r.page} de ${number(pageCount)}</span><button class="btn btn-outline btn-sm" data-action="rankPage" data-page="${r.page+1}" ${r.page===pageCount?'disabled':''}>Siguiente →</button></div>`:''}
 <p class="caption-text">*El Excel no contiene escalas independientes de utilidad universitaria o colaboración IMEF. Se priorizan registros con metodología/indicador o aporte potencial documentados y se desempata con el índice original. No se inventan probabilidades de éxito.</p></section>`;
}
function renderMatrix(){
 const d=app.data,{esc,number,band}=U();const key=app.state.matrixPair;
 let pairHtml='';
 if(key){const [t,p]=key.split('|');const list=d.proposals.filter(r=>r.themeId===t&&r.problemId===p).sort((a,b)=>b.score-a.score);
 pairHtml=`<section class="panel pair-panel"><div class="panel-heading"><div><span class="eyebrow small">SELECCIÓN TEMA × PROBLEMA</span><h2>${esc(d.catalog.topics[t]?.name)} × ${esc(d.catalog.problems[p]?.name)}</h2><p>${number(list.length)} sectores compatibles aprobados · Relación T–P: ${d.matrices.tp[key]??'—'}/3</p></div><button class="btn btn-outline btn-sm" data-action="matrixClear">Cerrar</button></div>${list.length?`<div class="pair-chips">${list.map(r=>`<button class="pair-chip" data-action="openProject" data-id="${r.id}"><span>${esc(r.sector)}</span><b>${r.score}/100 ↗</b></button>`).join('')}</div>`:`<div class="empty-state slim"><p>No hay combinaciones aprobadas para esta pareja. Puedes explorar otro problema o tema.</p></div>`}</section>`;}
 return `<section class="page-entry"><div class="eyebrow">VISUALIZACIÓN / 20 × 20</div><div class="section-heading"><div><h1>Matriz de coherencia<span class="title-period">.</span></h1><p>Cada celda indica cuántos sectores aprobados conectan un tema con un problema. Selecciona para abrir sus resultados.</p></div></div><div class="matrix-legend"><span><i class="heat-key strong"></i> Relación directa (3)</span><span><i class="heat-key moderate"></i> Relación defendible (2)</span><span><i class="heat-key empty"></i> Sin cruces aprobados</span></div><div class="panel matrix-panel">${C().matrix(d,key)}<p class="caption-text">Colores basados en la matriz tema–problema; cifras basadas en registros aprobados. La aprobación final también requiere relaciones con el sector e índice ≥67.</p></div>${pairHtml}</section>`;
}
function renderNetwork(){
 const d=app.data,id=app.state.networkTheme;
 return `<section class="page-entry"><div class="eyebrow">VISUALIZACIÓN / RED DE AFINIDADES</div><div class="section-heading"><div><h1>Mapa de relaciones<span class="title-period">.</span></h1><p>Observa cómo un tema se conecta con sus problemas y sectores más frecuentes; toca un nodo para explorar registros.</p></div></div><div class="network-controls"><label>Elige un tema <select data-control="networkTheme">${d.topics.map(v=>F().option(v.id,v.name,id)).join('')}</select></label><button class="btn btn-outline btn-sm" data-action="networkAll" data-id="${id}">Explorar sus ${U().number(d.proposals.filter(v=>v.themeId===id).length)} propuestas →</button></div><div class="panel network-panel">${C().relations(d,id)}</div></section>`;
}
function renderRelevance(){
 const d=app.data,s=app.state.relevance,{esc,number,regional,coherence}=U();
 const options=[['regional','Yucatán · pertinencia territorial'],['university','Universidad · potencial académico'],['imef','IMEF · colaboración potencial']];
 const perspective=s.perspective;
 const filtered=d.proposals.filter(r=>(!s.theme||r.themeId===s.theme)&&(!s.sector||r.sectorId===s.sector));
 filtered.sort(perspective==='regional'?U().getSort(d,'regional'):U().getSort(d,perspective));
 const shown=filtered.slice(0,s.limit);
 const descriptions={regional:'La clasificación territorial compara la relevancia base del problema con el peso editorial del sector (ambos de 1 a 3). No sustituye evidencia regional.',university:'Los registros incluyen método e indicador sugeridos para la universidad. No existe una escala original de facilidad de ejecución o beneficio académico.',imef:'El Excel identifica aportes potenciales de especialidades del IMEF. No acredita participación, recursos, acceso a datos ni compromisos formales.'};
 return `<section class="page-entry"><div class="eyebrow">PERSPECTIVAS / VALOR DE LA INVESTIGACIÓN</div><div class="section-heading"><div><h1>Explorar por relevancia<span class="title-period">.</span></h1><p>Compara tres perspectivas de utilidad sin atribuir calificaciones inexistentes a las instituciones.</p></div></div>
 <div class="relevance-cards"><button class="relevance-card ${perspective==='regional'?'active':''}" data-action="relevancePerspective" data-mode="regional"><span class="relevance-mark">Y</span><b>Para Yucatán</b><p>Peso territorial y pertinencia temática de los retos.</p><strong>Explorar →</strong></button><button class="relevance-card ${perspective==='university'?'active':''}" data-action="relevancePerspective" data-mode="university"><span class="relevance-mark blue">U</span><b>Para la universidad</b><p>Metodología, indicadores y oportunidad de aprendizaje.</p><strong>Explorar →</strong></button><button class="relevance-card ${perspective==='imef'?'active':''}" data-action="relevancePerspective" data-mode="imef"><span class="relevance-mark gold">I</span><b>Para el IMEF</b><p>Experiencia financiera y orientación de la investigación.</p><strong>Explorar →</strong></button></div>
 <div class="method-banner relevance-explain"><span>ⓘ</span><div><h2>${options.find(([key])=>key===perspective)[1]}</h2><p>${descriptions[perspective]} El índice original es el criterio de desempate para enfoques sin puntuación independiente.</p></div></div>
 <div class="filter-card"><div class="filters-grid relevance-filters"><label>Tema<select data-control="relevanceTheme"><option value="">Todos los temas</option>${d.topics.map(r=>F().option(r.id,r.name,s.theme)).join('')}</select></label><label>Sector<select data-control="relevanceSector"><option value="">Todos los sectores</option>${d.sectors.map(r=>F().option(r.id,r.name,s.sector)).join('')}</select></label><label>Mostrar<select data-control="relevanceLimit">${[['10','10 investigaciones'],['25','25 investigaciones'],['50','50 investigaciones']].map(([v,t])=>F().option(v,t,s.limit)).join('')}</select></label></div></div>
 <div class="results-toolbar"><div><strong>${number(filtered.length)} oportunidades</strong> · ordenadas por ${perspective==='regional'?'peso territorial y prioridad':'criterios documentados e índice editorial'}</div></div>
 <div class="result-list">${shown.map(r=>`<article class="project-card relevance-result"><div class="relevance-result-main"><span class="folio">${esc(r.id)}</span><button class="project-title" data-action="openProject" data-id="${r.id}">${esc(r.title)}</button><p>${esc(r.theme)} · ${esc(r.problem)} · ${esc(r.sector)}</p><div class="relevance-annotation"><b>${perspective==='regional'?'PESO TERRITORIAL':perspective==='university'?'MÉTODO UNIVERSITARIO':'APORTE IMEF'}</b><span>${perspective==='regional'?`Relevancia base del problema ${d.catalog.problems[r.problemId]?.relevance??'—'}/3 · Peso sector ${d.catalog.sectors[r.sectorId]?.weight??'—'}/3`:(perspective==='university'?esc(r.method)+' · '+esc(r.indicator):esc(r.imef))}</span></div></div><div class="relevance-result-score"><small>ÍNDICE ORIGINAL</small><strong>${r.score}<span>/100</span></strong>${perspective==='regional'?`<small>PERTINENCIA ORIENTATIVA</small><b>${regional(d,r)??'—'}/100</b>`:''}<button class="btn btn-outline btn-sm" data-action="openProject" data-id="${r.id}">Ver ficha →</button></div></article>`).join('')}</div></section>`;
}
function renderCompare(){
 const d=app.data,ids=app.state.compare,r=ids.map(id=>d.proposals.find(v=>v.id===id)).filter(Boolean),{esc,coherence,regional,band}=U();
 if(!r.length)return `<section class="page-entry"><div class="eyebrow">MI ESPACIO / COMPARACIÓN</div><div class="section-heading"><div><h1>Comparador<span class="title-period">.</span></h1><p>Agrega entre dos y cuatro investigaciones para confrontar criterios y enfoques.</p></div></div><div class="empty-state"><div class="empty-icon">⇄</div><h2>Empieza a comparar</h2><p>Selecciona el símbolo ⇄ en las tarjetas del buscador o de los rankings.</p><button class="btn btn-primary" data-nav="search">Explorar investigaciones →</button></div></section>`;
 const tr=(label,fn)=>`<tr><th>${label}</th>${r.map(v=>`<td>${fn(v)}</td>`).join('')}</tr>`;
 return `<section class="page-entry"><div class="eyebrow">MI ESPACIO / COMPARACIÓN</div><div class="section-heading"><div><h1>Comparador<span class="title-period">.</span></h1><p>${r.length} de 4 investigaciones seleccionadas. Indicadores originales y orientativos diferenciados.</p></div><button class="btn btn-outline btn-sm" data-action="clearCompare">Vaciar comparador</button></div>${r.length<2?`<div class="info-notice">Agrega otra investigación para realizar una comparación lado a lado.</div>`:''}
 <div class="comparison-scroll"><table class="comparison-table"><thead><tr><th>DIMENSIÓN</th>${r.map(v=>`<th><small>${esc(v.id)}</small><strong>${esc(v.title)}</strong><button class="text-button" data-action="toggleCompare" data-id="${v.id}">Quitar ×</button></th>`).join('')}</tr></thead><tbody>
 ${tr('Prioridad editorial (Excel)',v=>`${band(v.score).label}<div class="comp-bar"><i style="width:${v.score}%"></i></div><strong>${v.score}/100</strong>`)}
 ${tr('Coherencia temática (matrices)',v=>`<div class="comp-bar cyan"><i style="width:${coherence(d,v)||0}%"></i></div><strong>${coherence(d,v)??'—'}/100</strong>`)}
 ${tr('Pertinencia territorial orientativa',v=>`<div class="comp-bar turquoise"><i style="width:${regional(d,v)||0}%"></i></div><strong>${regional(d,v)??'—'}/100</strong>`)}
 ${tr('Tema',v=>esc(v.theme))}${tr('Problema',v=>esc(v.problem))}${tr('Sector',v=>esc(v.sector))}${tr('Método académico',v=>esc(v.method))}${tr('Indicador sugerido',v=>esc(v.indicator))}${tr('Aporte potencial del IMEF',v=>esc(v.imef))}
 ${tr('Abrir ficha',v=>`<button class="btn btn-outline btn-sm" data-action="openProject" data-id="${v.id}">Ver ${esc(v.id)} ↗</button>`)}
 </tbody></table></div><p class="caption-text">La pertinencia territorial es orientativa (pesos de problema y sector). La capacidad de investigación y apoyo del IMEF deben confirmarse; no se muestran como compromisos institucionales.</p></section>`;
}
function renderFavorites(){
 const d=app.data,r=d.proposals.filter(v=>app.state.favorites.has(v.id));
 return `<section class="page-entry"><div class="eyebrow">MI ESPACIO / GUARDADOS EN ESTE NAVEGADOR</div><div class="section-heading"><div><h1>Mis favoritos<span class="title-period">.</span></h1><p>${U().number(r.length)} investigaciones guardadas localmente en este navegador.</p></div>${r.length?`<button class="btn btn-outline btn-sm" data-action="clearFavorites">Borrar favoritos</button>`:''}</div>${r.length?`<div class="result-list">${r.map(v=>projectCard(v)).join('')}</div>`:`<div class="empty-state"><div class="empty-icon">♡</div><h2>Aún no tienes investigaciones favoritas</h2><p>Guarda los proyectos más interesantes para revisarlos después.</p><button class="btn btn-primary" data-nav="search">Ir al buscador →</button></div>`}</section>`;
}
function renderMethod(){
 const d=app.data,{esc}=U();const list=d.methods.filter(v=>v.key!=='CRITERIO'&&v.key!=='OBJETIVO');
 return `<section class="page-entry"><div class="eyebrow">CRITERIOS Y TRANSPARENCIA</div><div class="section-heading"><div><h1>Metodología<span class="title-period">.</span></h1><p>Qué evalúa el Excel, qué estima el explorador y qué se debe comprobar antes de investigar.</p></div></div>
 <div class="method-banner"><span>ⓘ</span><div><h2>Una cartera de hipótesis, no un diagnóstico probado</h2><p>Las propuestas no demuestran que exista un problema en una organización concreta. El IMEF no ha asumido una obligación de aportar datos ni recursos.</p></div></div>
 <div class="method-grid"><div class="panel"><span class="eyebrow small">REGLA EDITORIAL ORIGINAL</span><h2>Cómo se aceptó un cruce</h2><div class="method-steps"><div><b>1</b><span>Tema ↔ problema: relación lógica</span></div><div><b>2</b><span>Tema ↔ sector: aplicabilidad</span></div><div><b>3</b><span>Problema ↔ sector: pertinencia</span></div><div><b>4</b><span>Las tres relaciones son 2 o 3 y el índice alcanza 67/100</span></div></div><div class="formula-card"><span>ÍNDICE HEURÍSTICO DEL EXCEL</span><strong>REDONDEAR(0.88 × [(4·TP + 3·TS + 3·PS) ÷ 30 × 100] + 1.5·R<sub>problema</sub> + 1.5·P<sub>sector</sub>)</strong><p>Relaciones: 0 insuficiente, 2 defendible, 3 directa.</p></div></div>
 <div class="panel"><span class="eyebrow small">LAS CINCO PERSPECTIVAS</span><h2>Cómo leer la ficha</h2><div class="perspective-list"><div><b>Coherencia temática</b><span>Calculada con T–P, T–S y P–S de las matrices.</span></div><div><b>Relevancia en Yucatán</b><span>Indicador orientativo a partir de dos pesos editoriales (no mide impacto real).</span></div><div><b>Viabilidad académica</b><span>Índice editorial del Excel + método sugerido; acceso a datos pendiente de comprobar.</span></div><div><b>Aprovechamiento del IMEF</b><span>Texto de aportación potencial; sin puntuación independiente.</span></div><div><b>Beneficio institucional</b><span>Interpretación y aplicación posible; sin convenio o utilidad cuantificada.</span></div></div></div></div>
 <div class="panel method-table"><div class="panel-heading"><h2>Notas metodológicas originales</h2><span class="info-tag">Hoja METODOLOGIA</span></div><div class="method-rows">${list.map(v=>`<div><strong>${esc(v.key)}</strong><p>${esc(v.value)}</p></div>`).join('')}</div></div>
 <div class="panel method-table"><div class="panel-heading"><h2>Fuentes públicas de partida</h2><span class="info-tag">Hoja FUENTES</span></div><div class="source-list">${d.sources.map(v=>`<div><span>${esc(v.id)}</span><div><strong>${esc(v.title)}</strong><p>${esc(v.author)}</p></div>${/^https?:\/\//.test(v.url)?`<a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Consultar ↗</a>`:''}</div>`).join('')}</div></div></section>`;
}
function render(){
 if(!app.data)return;
 const view=app.state.view;
 const renders={home:renderHome,explore:()=>E().renderExplore(app),detail:()=>E().renderDetail(app),rankings:renderRankings,search:()=>F().renderSearch(app),matrix:renderMatrix,network:renderNetwork,relevance:renderRelevance,sectors:()=>E().renderSectors(app),compare:renderCompare,favorites:renderFavorites,method:renderMethod};
 main.innerHTML=(renders[view]||renderHome)();
 const navview=view==='detail'?app.state.previous:view;
 document.querySelectorAll('.nav-link').forEach(el=>{const active=el.dataset.nav===navview;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 const titles={home:'Inicio',explore:'Exploremos',detail:'Ficha de investigación',rankings:'Rankings',search:'Buscador avanzado',matrix:'Matriz de coherencia',network:'Mapa de relaciones',relevance:'Relevancia institucional',sectors:'Explorar por sectores',compare:'Comparador',favorites:'Favoritos',method:'Metodología'};
 document.getElementById('current-page-label').textContent=titles[view]||'Inicio';
 document.getElementById('favorite-count').textContent=app.data.proposals.filter(r=>app.state.favorites.has(r.id)).length;
 document.getElementById('compare-count').textContent=app.state.compare.length;
 document.getElementById('sidebar-count').textContent=U().number(app.data.counts.approved)+' investigaciones';
}
function downloadFicha(record){
 const d=app.data,{esc,coherence,regional,pair}=U();
 const html=`<!doctype html><html lang="es"><meta charset="utf-8"><title>Ficha ${esc(record.id)}</title><style>body{font:15px/1.65 Arial,sans-serif;max-width:850px;margin:50px auto;padding:24px;color:#17263f}header{background:#0b1934;color:white;padding:32px;border-radius:12px}h1{font-size:25px;line-height:1.3}h2{font-size:18px;border-bottom:2px solid #38b8ac;padding-bottom:6px}dl{display:grid;grid-template-columns:180px 1fr;gap:10px}dt{font-weight:bold}dd{margin:0}small{color:#607086}.note{background:#eef8f6;padding:16px;border-radius:8px}@media print{body{margin:8px}}</style><header><small style="color:#b0c4da">IMEF RESEARCH EXPLORER · YUCATÁN · ${esc(record.id)}</small><h1>${esc(record.title)}</h1></header><h2>Datos de investigación</h2><dl><dt>Tema</dt><dd>${esc(record.theme)}</dd><dt>Problema</dt><dd>${esc(record.problem)}</dd><dt>Sector</dt><dd>${esc(record.sector)}</dd><dt>Índice original</dt><dd>${record.score}/100</dd><dt>Coherencia ponderada</dt><dd>${coherence(d,record)??'Sin dato'}/100</dd><dt>Peso territorial orientativo</dt><dd>${regional(d,record)??'Sin dato'}/100</dd><dt>Método propuesto</dt><dd>${esc(record.method)}</dd><dt>Indicador</dt><dd>${esc(record.indicator)}</dd><dt>Aporte IMEF potencial</dt><dd>${esc(record.imef)}</dd><dt>Fuente de partida</dt><dd>${esc(record.url)}</dd></dl><h2>Relaciones de coherencia</h2><p>Tema–Problema: ${pair(d,record).tp??'—'}/3 · Tema–Sector: ${pair(d,record).ts??'—'}/3 · Problema–Sector: ${pair(d,record).ps??'—'}/3</p><h2>Riesgos a evaluar</h2><p>Acceso a participantes y fuentes, consentimiento, confidencialidad, tiempo de recolección y tamaño muestral requieren verificación antes de la ejecución.</p><p class="note">Investigación propuesta, no diagnóstico confirmado. Las aportaciones del IMEF son potenciales y no presuponen compromiso ni datos privados. La pertinencia territorial adicional es un cálculo orientativo basado en ponderaciones editoriales.</p></html>`;
 const blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Ficha_IMEF_'+record.id+'.html';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function toggleFavorite(id){if(app.state.favorites.has(id))app.state.favorites.delete(id);else app.state.favorites.add(id);const saved=window.IMEFFavorites.save(app.state.favorites);render();toast(saved?'Favoritos actualizados.':'No se pudieron guardar favoritos en este navegador.');}
function toggleCompare(id){const arr=app.state.compare;if(arr.includes(id))arr.splice(arr.indexOf(id),1);else{if(arr.length>=4)return toast('Puedes comparar un máximo de cuatro investigaciones.');arr.push(id);}render();toast(arr.includes(id)?'Investigación agregada al comparador.':'Investigación retirada del comparador.');}
function closeMobile(){document.body.classList.remove('mobile-menu');}
async function copyTitle(id){const title=app.data.proposals.find(r=>r.id===id)?.title;if(!title)return;
 try{await navigator.clipboard.writeText(title);toast('Título copiado al portapapeles.');}catch{const txt=document.createElement('textarea');txt.value=title;document.body.append(txt);txt.select();document.execCommand('copy');txt.remove();toast('Título copiado.');}}
function handleAction(action,el){const id=el.dataset.id;
 switch(action){
 case 'upload':document.getElementById('excel-file').click();break;
 case 'surprise':{const set=app.data.proposals.filter(r=>r.score>=90);if(set.length)openProject(set[Math.floor(Math.random()*set.length)].id);break;}
 case 'openRankMode':navigate('rankings',{mode:el.dataset.mode});break;
 case 'openRegional':navigate('relevance');break;
 case 'relevancePerspective':app.state.relevance.perspective=el.dataset.mode;render();break;
 case 'exploreTheme':Object.assign(app.state.explore,{step:2,theme:id,problem:''});render();window.scrollTo({top:0,behavior:'instant'});break;
 case 'exploreProblem':Object.assign(app.state.explore,{step:3,problem:id});render();window.scrollTo({top:0,behavior:'instant'});break;
 case 'exploreBack':app.state.explore.step=Math.max(1,app.state.explore.step-1);if(app.state.explore.step===1)app.state.explore.theme='';if(app.state.explore.step===2)app.state.explore.problem='';render();window.scrollTo({top:0,behavior:'instant'});break;
 case 'resetExplore':app.state.explore={step:1,theme:'',problem:'',order:'coherence'};render();break;
 case 'openProject':openProject(id);break;
 case 'goPrevious':navigate(app.state.previous||'home');break;
 case 'copyTitle':copyTitle(id);break;
 case 'downloadFicha':{const r=app.data.proposals.find(v=>v.id===id);if(r)downloadFicha(r);break;}
 case 'toggleFavorite':toggleFavorite(id);break;
 case 'toggleCompare':toggleCompare(id);break;
 case 'clearFavorites':app.state.favorites.clear();window.IMEFFavorites.save(app.state.favorites);render();toast('Favoritos eliminados.');break;
 case 'clearCompare':app.state.compare=[];render();break;
 case 'relatedProjects':{const r=app.data.proposals.find(v=>v.id===id);if(r)setFilters({theme:r.themeId,problem:'',sector:'',query:'',sort:'score'});break;}
 case 'clearFilters':app.state.filters={query:'',theme:'',problem:'',sector:'',band:'',regional:'',imef:'',sort:'score',page:1};render();break;
 case 'searchPage':app.state.filters.page=Number(el.dataset.page);render();window.scrollTo({top:150,behavior:'instant'});break;
 case 'rankPage':app.state.rank.page=Number(el.dataset.page);render();window.scrollTo({top:150,behavior:'instant'});break;
 case 'rankMode':app.state.rank.mode=el.dataset.mode;app.state.rank.sort=app.state.rank.mode==='low'?'low':'score';app.state.rank.reason='';app.state.rank.page=1;render();break;
 case 'alternatives':{const r=app.data.rejected.find(v=>v.id===id);if(r){const exact=app.data.proposals.filter(v=>v.themeId===r.themeId&&v.problemId===r.problemId);if(exact.length)setFilters({theme:r.themeId,problem:r.problemId,sector:'',query:'',sort:'score',regional:'',imef:'',band:''});else setFilters({theme:r.themeId,problem:'',sector:'',query:'',sort:'score',regional:'',imef:'',band:''});toast(exact.length?'Alternativas aprobadas para el mismo tema y problema.':'No hay sectores aprobados para esta pareja; se muestran otros problemas del tema.');}break;}
 case 'matrixPair':app.state.matrixPair=el.dataset.t+'|'+el.dataset.p;render();requestAnimationFrame(()=>document.querySelector('.pair-panel')?.scrollIntoView({behavior:'smooth',block:'nearest'}));break;
 case 'matrixClear':app.state.matrixPair='';render();break;
 case 'networkPair':setFilters({theme:el.dataset.t,problem:el.dataset.p,sector:'',query:'',band:'',regional:'',imef:'',sort:'score'});break;
 case 'networkSector':setFilters({theme:'',problem:'',sector:el.dataset.s,query:'',band:'',regional:'',imef:'',sort:'score'});break;
 case 'networkAll':setFilters({theme:id,problem:'',sector:'',query:'',band:'',regional:'',imef:'',sort:'score'});break;
 case 'sectorChoose':app.state.sectors={sector:id,problem:''};render();window.scrollTo({top:0,behavior:'instant'});break;
 case 'sectorProblem':app.state.sectors.problem=id;render();window.scrollTo({top:0,behavior:'instant'});break;
 case 'sectorBack':if(app.state.sectors.problem)app.state.sectors.problem='';else app.state.sectors.sector='';render();break;
 case 'resetSector':app.state.sectors={sector:'',problem:''};render();break;
 }
}
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-action],[data-nav]');if(!el||el.disabled)return;
 if(el.dataset.nav){navigate(el.dataset.nav);return;}
 handleAction(el.dataset.action,el);
});
document.addEventListener('change',e=>{
 const el=e.target;if(!el.dataset.control)return;
 const control=el.dataset.control,value=el.value;
 if(['theme','problem','sector','band','regional','imef','sort'].includes(control)){
  const f=app.state.filters;f[control]=value;f.page=1;
  if(control==='theme'){f.problem='';f.sector='';}
  if(control==='problem')f.sector='';
 }else if(control==='exploreOrder')app.state.explore.order=value;
 else if(control==='networkTheme')app.state.networkTheme=value;
 else if(control==='relevanceTheme')app.state.relevance.theme=value;
 else if(control==='relevanceSector')app.state.relevance.sector=value;
 else if(control==='relevanceLimit')app.state.relevance.limit=Number(value);
 else if(control==='rankMode'){app.state.rank.mode=value;app.state.rank.reason='';}
 else if(control==='rankSort'){app.state.rank.sort=value;app.state.rank.page=1;}
 else if(control==='rankLimit'){app.state.rank.limit=value==='all'?'all':Number(value);app.state.rank.page=1;}
 else if(control==='discardReason'){app.state.rank.reason=value;app.state.rank.page=1;}
 render();
});
document.addEventListener('input',e=>{
 const el=e.target;if(el.dataset.control!=='query')return;
 app.state.filters.query=el.value;app.state.filters.page=1;
 const a=el.selectionStart??0,b=el.selectionEnd??0;
 render();const input=document.getElementById('keyword-search');if(input){input.focus({preventScroll:true});input.setSelectionRange(a,b);}
});
document.getElementById('top-upload').addEventListener('click',()=>document.getElementById('excel-file').click());
document.getElementById('menu-toggle').addEventListener('click',()=>document.body.classList.toggle('mobile-menu'));
document.getElementById('mobile-backdrop').addEventListener('click',closeMobile);
document.getElementById('excel-file').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 const old=document.getElementById('top-upload');old.disabled=true;old.textContent='Leyendo Excel…';
 try{const data=await window.IMEFLoader.parse(await file.arrayBuffer(),file.name);app.data=data;app.state.filters={query:'',theme:'',problem:'',sector:'',band:'',regional:'',imef:'',sort:'score',page:1};app.state.compare=[];app.state.explore={step:1,theme:'',problem:'',order:'coherence'};app.state.sectors={sector:'',problem:''};navigate('home');toast('Archivo actualizado en esta sesión: '+U().number(data.proposals.length)+' propuestas válidas. No se ha modificado GitHub.');}
 catch(err){console.error(err);toast('No se pudo importar: '+err.message);}
 finally{old.disabled=false;old.textContent='↥ Actualizar Excel';e.target.value='';}
});
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobile();});
window.IMEFApp=app;
(async()=>{
 try{app.data=await window.IMEFLoader.autoLoad();render();}
 catch(err){console.error('Error de carga',err);main.innerHTML=`<div class="load-error"><div class="empty-icon">!</div><h1>No se pudo cargar la megabase</h1><p>${U().esc(err.message)}</p><p>Publica esta carpeta en GitHub Pages o inicia un servidor local para permitir la carga de <code>./data/IMEF_Yucatan_Megabase.xlsx</code>. También puedes seleccionar el archivo desde tu computadora.</p><button class="btn btn-primary" data-action="upload">Cargar Excel manualmente</button></div>`;}
})();
})();
