(() => {
  'use strict';
  const key='imef-research-explorer-favorites-v1';
  const load=()=>{try {const raw=JSON.parse(localStorage.getItem(key)||'[]');return new Set(Array.isArray(raw)?raw:[]);}catch{return new Set();}};
  const save=ids=>{try {localStorage.setItem(key,JSON.stringify([...ids]));return true;}catch{return false;}};
  window.IMEFFavorites={load,save};
})();
