/* XLSX reader powered by the locally bundled JSZip (no server, CDN or API key).
   Reads the actual workbook each time, including matrices and exclusions. */
(() => {
  'use strict';
  const ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const nsR = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const XML = str => {
    const doc = new DOMParser().parseFromString(str, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('No se pudo interpretar una hoja XML del archivo Excel.');
    return doc;
  };
  const child = (node,name) => [...(node?.children||[])].find(el=>el.localName===name);
  const children = (node,name) => [...(node?.children||[])].filter(el=>el.localName===name);
  const colIndex = ref => [...(ref.match(/^[A-Z]+/)?.[0]||'')].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0)-1;
  const tidy = val => String(val??'').trim();
  const norm = val => tidy(val).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
  const headersFor = {
    proposals: ['Tema','Problema','Sector','Título de investigación','Folio','ID tema','ID problema','ID sector','Prioridad','Índice / 100','Indicador sugerido','Método para la universidad','Aporte potencial del IMEF','Fuente pública de partida (URL)'],
    rejected: ['Tema','Problema','Sector','Motivo del descarte','Folio','ID tema','ID problema','ID sector','Índice','Coherencia T-P','Coherencia T-S','Coherencia P-S'],
    topics: ['ID','Tema base','Enfoque','Método viable para universidad','Aporte potencial del IMEF','Código fuente','Fuente institucional'],
    problems: ['ID','Problema investigable','Significado operativo','Redacción en título','Relevancia base (1–3)','Indicador medible','Fuente de contraste'],
    sectors: ['ID','Sector o población objetivo','Tipo de actividad','Ámbito territorial','Peso territorial (1–3)','Fuente base','URL de contexto']
  };
  const keysFor = {
    proposals: ['theme','problem','sector','title','id','themeId','problemId','sectorId','priority','score','indicator','method','imef','url'],
    rejected: ['theme','problem','sector','reason','id','themeId','problemId','sectorId','score','tp','ts','ps'],
    topics: ['id','name','description','method','imef','sourceCode','url'],
    problems: ['id','name','description','titleFragment','relevance','indicator','url'],
    sectors: ['id','name','activity','location','weight','source','url']
  };
  const numericKeys = new Set(['score','tp','ts','ps','weight','relevance']);
  async function readWorkbook(arrayBuffer) {
    if (!window.JSZip) throw new Error('No se cargó la biblioteca local de archivos Excel.');
    const zip = await window.JSZip.loadAsync(arrayBuffer);
    const getXml = async name => {
      const entry = zip.file(name);
      if (!entry) throw new Error('Falta un archivo interno del Excel: '+name);
      return XML(await entry.async('string'));
    };
    const workbook = await getXml('xl/workbook.xml');
    const rels = await getXml('xl/_rels/workbook.xml.rels');
    const map = {};
    for (const r of [...rels.documentElement.children]) if(r.localName==='Relationship') map[r.getAttribute('Id')]=r.getAttribute('Target');
    const sheetPaths = {};
    const sheetNodes = [...workbook.getElementsByTagNameNS(ns,'sheet')];
    for(const s of sheetNodes){
      const path = map[s.getAttributeNS(nsR,'id')||s.getAttribute('r:id')];
      if(!path) continue;
      sheetPaths[s.getAttribute('name')] = path.startsWith('/')?path.slice(1):(path.startsWith('xl/')?path:'xl/'+path.replace(/^\.\//,''));
    }
    let shared=[];
    if(zip.file('xl/sharedStrings.xml')){
      const xml=await getXml('xl/sharedStrings.xml');
      shared=[...xml.getElementsByTagNameNS(ns,'si')].map(si=>[...si.getElementsByTagNameNS(ns,'t')].map(t=>t.textContent).join(''));
    }
    const sheetRows = {};
    for(const [name,path] of Object.entries(sheetPaths)){
      const xml=await getXml(path);
      const rows=[];
      const rowNodes=xml.getElementsByTagNameNS(ns,'row');
      for(const row of rowNodes){
        const out=[];
        for(const c of children(row,'c')){
          const index=colIndex(c.getAttribute('r')||'A1'); if(index<0||index>300)continue;
          const type=c.getAttribute('t'); const v=child(c,'v');
          let value='';
          if(type==='inlineStr')value=[...(child(c,'is')?.getElementsByTagNameNS(ns,'t')||[])].map(t=>t.textContent).join('');
          else if(v){
            const raw=v.textContent;
            value=type==='s'?(shared[Number(raw)]??''):(type==='b'?raw==='1':(['str','e'].includes(type)?raw:(Number.isFinite(Number(raw))?Number(raw):raw)));
          }
          out[index]=value;
        }
        if(out.some(v=>v!==undefined&&v!=='')) rows.push(out);
      }
      sheetRows[name]=rows;
    }
    return sheetRows;
  }
  function mapTable(rows,kind,errors){
    if(!rows)throw new Error('No se encontró la hoja requerida: '+kind+'.');
    const expected=headersFor[kind],keys=keysFor[kind];
    const headerPos=rows.findIndex(r=>{
      const present=new Set(r.map(norm));
      return expected.slice(0,kind==='rejected'?5:4).filter(h=>present.has(norm(h))).length >= (kind==='rejected'?5:4);
    });
    if(headerPos<0) throw new Error('La hoja '+kind+' no contiene los encabezados esperados.');
    const header=rows[headerPos].map(norm);
    const positions=expected.map(h=>header.indexOf(norm(h)));
    const missing=expected.filter((h,i)=>positions[i]<0);
    if(missing.length)throw new Error('Faltan columnas en '+kind+': '+missing.join(', ')+'.');
    const data=[];
    for(let n=headerPos+1;n<rows.length;n++){
      const r=rows[n],out={};
      for(let i=0;i<keys.length;i++){
        let val=r[positions[i]]??'';
        out[keys[i]]=numericKeys.has(keys[i])?(val===''?null:Number(val)):tidy(val);
      }
      if(!out.id)continue;
      if(kind==='proposals'||kind==='rejected'){
        if(!out.themeId||!out.problemId||!out.sectorId||!Number.isFinite(out.score)|| (kind==='proposals'&&!out.title)){
          if(errors.length<20)errors.push('Fila '+(n+1)+' de '+kind+': campos clave incompletos.'); continue;
        }
      }
      data.push(out);
    }
    return data;
  }
  function readMatrices(rows) {
    const matrices={tp:{},ts:{},ps:{}};
    if(!rows)return matrices;
    const configs=[{key:'tp',start:'Tema',prefix:'P',id:'T'},{key:'ts',start:'Tema',prefix:'S',id:'T'},{key:'ps',start:'Problema',prefix:'S',id:'P'}];
    for(const config of configs){
      const start=rows.findIndex((r,i)=> norm(r[0])===norm(config.start) && /^([A-Z]\d\d)$/.test(tidy(r[1]))&&tidy(r[1]).startsWith(config.prefix));
      if(start<0)continue;
      const header=rows[start];
      for(let i=start+1;i<Math.min(rows.length,start+21);i++){
        const r=rows[i],a=tidy(r[0]);if(!new RegExp('^'+config.id+'\\d{2}$').test(a))break;
        for(let j=1;j<header.length;j++){
          const b=tidy(header[j]);const value=Number(r[j]);
          if(/^([PS]\d\d)$/.test(b)&&[0,2,3].includes(value))matrices[config.key][a+'|'+b]=value;
        }
      }
    }
    return matrices;
  }
  function buildData(sheets,name){
    const get=n=>sheets[Object.keys(sheets).find(k=>norm(k)===norm(n))];
    const errors=[];
    const proposals=mapTable(get('PROPUESTAS'),'proposals',errors);
    const rejected=mapTable(get('DESCARTADAS'),'rejected',errors);
    const topics=mapTable(get('20 TEMAS'),'topics',errors);
    const problems=mapTable(get('20 PROBLEMAS'),'problems',errors);
    const sectors=mapTable(get('20 SECTORES'),'sectors',errors);
    if(!proposals.length||!topics.length||!problems.length||!sectors.length)throw new Error('La megabase no contiene registros suficientes en sus catálogos principales.');
    const matrices=readMatrices(get('MATRICES'));
    const prioritySheet=get('PRIORITARIAS')||[];
    const chosen=prioritySheet.flatMap(r=>r.filter(v=>typeof v==='string'&&/^IY-\d+$/.test(v)));
    const priorityIds=new Set(chosen);
    const itemId=new Set(), comboId=new Set();
    for(const [kind,rows] of [['aprobadas',proposals],['descartadas',rejected]]){
      for(const r of rows){
        const combo=[r.themeId,r.problemId,r.sectorId].join('|');
        if(itemId.has(r.id))errors.push('Folio duplicado: '+r.id);
        if(comboId.has(combo))errors.push('Combinación repetida o compartida entre hojas: '+combo);
        itemId.add(r.id);comboId.add(combo);
      }
    }
    const catalog={topics:Object.fromEntries(topics.map(v=>[v.id,v])),problems:Object.fromEntries(problems.map(v=>[v.id,v])),sectors:Object.fromEntries(sectors.map(v=>[v.id,v]))};
    for(const r of proposals){
      if(!catalog.topics[r.themeId]||!catalog.problems[r.problemId]||!catalog.sectors[r.sectorId]){
        if(errors.length<30)errors.push('Referencia sin catálogo: '+r.id);
      }
      r.featured=priorityIds.has(r.id);
    }
    const count=proposals.length+rejected.length;
    const methodRows=(get('METODOLOGIA')||[]).filter(r=>r[0]&&r[1]).map(r=>({key:tidy(r[0]),value:tidy(r[1])}));
    const sources=(get('FUENTES')||[]).filter(r=>/^F\d+/.test(tidy(r[0]))).map(r=>({id:tidy(r[0]),author:tidy(r[2]),title:tidy(r[4]),url:tidy(r[6]),citation:tidy(r[7])}));
    if(proposals.length!==5270||rejected.length!==2730)errors.push('Los totales difieren del corte original 5270/2730 (puede ser una actualización válida).');
    if(count!==Math.pow(topics.length*problems.length*sectors.length,1)){
      errors.push('Las combinaciones cargadas ('+count+') no cubren todo el universo de '+(topics.length*problems.length*sectors.length)+'.');
    }
    return {proposals,rejected,topics,problems,sectors,matrices,catalog,priorityIds,methods:methodRows,sources,errors,name,counts:{approved:proposals.length,rejected:rejected.length,evaluated:count,veryHigh:proposals.filter(r=>r.score>=90).length,high:proposals.filter(r=>r.score>=80&&r.score<90).length},updatedAt:new Date().toISOString()};
  }
  async function parse(buffer,name='Excel actualizado'){
    const sheets=await readWorkbook(buffer);
    return buildData(sheets,name);
  }
  async function autoLoad(){
    const url='./data/IMEF_Yucatan_Megabase.xlsx';
    const response=await fetch(url,{cache:'no-cache'});
    if(!response.ok)throw new Error('No se encontró el archivo Excel local ('+response.status+').');
    return parse(await response.arrayBuffer(),'Megabase institucional · 28 oct 2026');
  }
  window.IMEFLoader={parse,autoLoad};
})();
