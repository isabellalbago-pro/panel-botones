// Carga y render de botones desde botones.json
const grid = document.getElementById('grid');
const resultado = document.getElementById('resultado');
const searchInput = document.getElementById('search');
const recargarBtn = document.getElementById('recargar');

let allButtons = [];

async function cargarDatos(){
  grid.setAttribute('aria-busy', 'true');
  try {
    const res = await fetch('botones.json', { cache: 'no-cache' });
    if(!res.ok) throw new Error('No se pudo cargar botones.json');
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error('El JSON debe ser un arreglo de objetos');
    allButtons = data;
    render(allButtons);
  } catch (err){
    console.error(err);
    grid.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3>Error al cargar datos</h3><p style="color:#b00020">' + err.message + '</p>';
    grid.appendChild(card);
  } finally {
    grid.removeAttribute('aria-busy');
  }
}

function render(list){
  grid.innerHTML = '';
  if(list.length === 0){
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = '<h3>Sin resultados</h3><p>Intenta otro término de búsqueda.</p>';
    grid.appendChild(empty);
    return;
  }

  list.forEach(item => {
    const { texto='(sin título)', tipo='nodata', url='', datos='' } = item || {};
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h3');
    title.textContent = texto;

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = tipo;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn ' + (tipo === 'link' ? 'btn--link' : tipo === 'mensaje' ? 'btn--mensaje' : 'btn--nodata');
    btn.textContent = (tipo === 'link' ? 'Abrir' : tipo === 'mensaje' ? 'Mostrar' : 'Sin datos');

    // Acciones por tipo
    if(tipo === 'link' && url){
      btn.addEventListener('click', () => {
        // Abrir en nueva pestaña de forma segura
        const w = window.open(url, '_blank', 'noopener,noreferrer');
        if(!w){ resultado.textContent = 'Tu navegador bloqueó la ventana emergente. Permite pop-ups o usa clic derecho > abrir enlace.'; }
      });
    }else if(tipo === 'mensaje' && datos){
      btn.addEventListener('click', () => {
        resultado.textContent = datos;
      });
    }else{
      btn.addEventListener('click', () => {
        resultado.textContent = '⚠️ Este botón no tiene datos asignados.';
      });
    }

    card.appendChild(title);
    card.appendChild(badge);
    card.appendChild(btn);
    grid.appendChild(card);
  });
}

function filtrar(){
  const q = (searchInput.value || '').toLowerCase().trim();
  if(!q){ render(allButtons); return; }
  const filtered = allButtons.filter(b => (b.texto || '').toLowerCase().includes(q));
  render(filtered);
}

searchInput.addEventListener('input', filtrar);
recargarBtn.addEventListener('click', cargarDatos);

window.addEventListener('DOMContentLoaded', cargarDatos);
