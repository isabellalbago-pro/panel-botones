const grid=document.getElementById('grid');const search=document.getElementById('search');let all=[];
async function load(){const file=document.body.dataset.file;const res=await fetch(file);all=await res.json();render(all)}
function render(list){grid.innerHTML='';list.forEach(it=>{const c=document.createElement('div');c.className='card';c.innerHTML='<h3>'+it.texto+'</h3>';grid.appendChild(c)})}
if(search)search.oninput=()=>{const q=search.value.toLowerCase();render(all.filter(i=>(i.texto||'').toLowerCase().includes(q)))};
window.onload=load;