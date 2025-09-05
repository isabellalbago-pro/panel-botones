// ====== ICONOS POR CATEGORÍA ======
const ICON = {
  "Links": "🔗",
  "Play Book": "📘",
  "Manuales": "📚",
  "Time Lines": "⏱️",
  "Presentaciones": "🖥️",
  "Troubleshooting": "🛠️",
  "SECCIÓN": "🗂️"
};

const grid = document.getElementById('grid');
const search = document.getElementById('search');
const resultEl = document.getElementById('result');
let all = [];

// Detecta si es la página principal (home) por la forma del JSON
function isHomeList(list){
  return Array.isArray(list) && list.length && ('ruta' in list[0] || 'nombre' in list[0]);
}

async function load(){
  const file = document.body.dataset.file; // p.ej. data/home.json o data/mes.json
  const res = await fetch(file, { cache: 'no-cache' });
  const data = await res.json();
  all = data;
  isHomeList(data) ? renderHome(data) : render(data);
}

// ---------- HOME (SECCIONES: MES/AMAX/TP) ----------
function renderHome(list){
  grid.innerHTML = '';
  list.forEach(it => {
    const { nombre='(Sección)', ruta='#', descripcion='' } = it || {};
    const icon = ICON['SECCIÓN'] || '';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${icon} ${nombre}</h3>
      ${descripcion ? `<div class="badge">${descripcion}</div>` : ''}
      <div class="actions">
        <a class="btn" href="${ruta}">Entrar</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---------- PÁGINAS DE CADA SECCIÓN ----------
function render(list){
  grid.innerHTML = '';
  if(!list.length){
    grid.innerHTML = '<div class="card"><h3>Sin resultados</h3></div>';
    return;
  }

  list.forEach(it => {
    const { texto='(sin título)', tipo='nodata', url='', datos='', categoria='' } = it || {};
    const icon = ICON[categoria] || '';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${icon ? icon + ' ' : ''}${texto}</h3>
      ${categoria ? `<div class="badge">${categoria}</div>` : ''}
    `;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btn = document.createElement('a');
    btn.className = 'btn';

    if(tipo === 'link' && url){
      btn.textContent = 'Abrir';
      btn.href = url;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    } else if(tipo === 'mensaje' && datos){
      btn.textContent = 'Mostrar';
      btn.href = '#';
      btn.onclick = () => { if(resultEl) resultEl.textContent = datos; };
    } else {
      btn.textContent = 'Sin datos';
      btn.href = '#';
      btn.onclick = () => { if(resultEl) resultEl.textContent = '⚠️ Sin datos'; };
    }

    actions.appendChild(btn);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

// ---------- BUSCADOR ----------
if(search){
  search.addEventListener('input', () => {
    const q = (search.value || '').toLowerCase().trim();
    if(!q){ isHomeList(all) ? renderHome(all) : render(all); return; }

    if(isHomeList(all)){
      const f = all.filter(x => (x.nombre || '').toLowerCase().includes(q));
      renderHome(f);
    }else{
      const f = all.filter(x =>
        (x.texto || '').toLowerCase().includes(q) ||
        (x.categoria || '').toLowerCase().includes(q)
      );
      render(f);
    }
  });
}

window.addEventListener('DOMContentLoaded', load);

