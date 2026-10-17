// draw rebar grid
const ns='http://www.w3.org/2000/svg',H=document.querySelector('.bars-h'),V=document.querySelector('.bars-v');
for(let i=0;i<11;i++){const l=document.createElementNS(ns,'line');const y=40+i*18;l.setAttribute('x1',35);l.setAttribute('x2',365);l.setAttribute('y1',y);l.setAttribute('y2',y);l.style.animationDelay=(i*.08)+'s';H.appendChild(l)}
for(let i=0;i<18;i++){const l=document.createElementNS(ns,'line');const x=40+i*19;l.setAttribute('y1',35);l.setAttribute('y2',225);l.setAttribute('x1',x);l.setAttribute('x2',x);l.style.animationDelay=(.6+i*.05)+'s';V.appendChild(l)}
// count-up
function countUp(el,to,fmt,dur=1600){const t0=performance.now();(function f(t){const p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=fmt(Math.round(to*e));if(p<1)requestAnimationFrame(f)})(t0)}
document.querySelectorAll('[data-count]').forEach(el=>countUp(el,+el.dataset.count,v=>v));
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');const m=e.target.querySelector('[data-money]');if(m&&!m.done){m.done=1;countUp(m,+m.dataset.money,v=>'$'+v.toLocaleString())}io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// calculator
const $=id=>document.getElementById(id);
function calc(){const area=+$('area').value,thk=+$('thk').value,rate=+$('ptype').value,price=+$('price').value||0;
$('areaOut').textContent=area.toLocaleString();$('thkOut').textContent=thk;
const vol=area*thk/1000,tonnes=vol*rate/1000;
$('rTonnes').textContent=tonnes.toFixed(2)+' t';
$('rValue').textContent='$'+Math.round(tonnes*price).toLocaleString();
$('rManual').textContent=Math.max(2,Math.round(area/60))+' hrs';
$('rLeva').textContent=Math.max(2,Math.round(2+area/900))+' min'}
['area','thk','ptype','price'].forEach(id=>$(id).addEventListener('input',calc));calc();
