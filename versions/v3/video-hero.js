class DonorVideoHero extends HTMLElement {
 connectedCallback(){
  const root=this.shadowRoot||this.attachShadow({mode:'open'});
  this.controller=new AbortController();const signal=this.controller.signal;
  root.innerHTML="<style>\n*{box-sizing:border-box}:host{display:block;width:100%;margin:0;background:white;color:#171717;font:16px Arial,sans-serif}main{height:100svh;position:relative;overflow:hidden}.gallery{position:absolute;inset:0;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none}.gallery:active{cursor:grabbing}.frame{position:absolute;top:50%;left:50%;width:34vw;height:min(35vw,61.25svh);overflow:hidden;border-radius:16px;background:#eee;will-change:transform}.frame video{position:absolute;width:146%;height:100%;left:-23%;object-fit:cover;pointer-events:none}footer{position:absolute;bottom:4vh;left:2.8vw;right:2.8vw;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;pointer-events:none}button{font:inherit;background:white;color:inherit;border:1px solid #d4d4d4;cursor:pointer}button:focus-visible{outline:2px solid #b71924}footer button{pointer-events:auto}.arrows{display:flex;gap:6px}.arrows button{width:42px;height:42px;border-radius:50%}.arrows button:hover{background:#151515;color:white}.person{cursor:default;user-select:text;border:0;text-align:left;justify-self:start;padding:5px 0;font-weight:600}.person small{display:block;font-size:12px;color:#666;font-weight:400;margin-top:5px}.count{justify-self:end;font-size:12px;font-variant-numeric:tabular-nums}dialog{border:0;border-radius:16px;max-width:min(420px,90vw);padding:32px;color:#222}dialog::backdrop{background:#0005}dialog p{line-height:1.55}dialog button{border-radius:20px;padding:8px 18px}svg{position:absolute;width:0;height:0}@media(max-width:660px){.frame{width:76vw;height:min(77vw,57svh)}footer{left:5vw;right:5vw}.arrows button{width:36px;height:36px}.person small{max-width:110px}}\nfooter{align-items:end}.person{max-width:38vw}.person i{display:block;font:700 10px/1.4 Arial;letter-spacing:.15em;text-transform:uppercase;color:#bc252b}.person span{display:block;font-size:clamp(22px,2.1vw,38px);margin:3px 0}.person small{max-width:48ch;font-size:clamp(13px,1vw,17px);line-height:1.35;color:#444}@media(max-width:660px){footer{grid-template-columns:1fr auto;gap:12px}.person{grid-column:1/-1;max-width:95%}.count{align-self:center}.frame{top:43%}}@media(max-height:550px){.frame{top:38%;height:51svh}.person small{font-size:12px}}header,.intro,#lokacija{padding-inline:5vw}header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-block:18px}header img{width:clamp(54px,5vw,78px);display:block}nav{display:flex;gap:26px}a{color:inherit;text-decoration:none}nav a:hover{text-decoration:underline;text-underline-offset:5px}.cta{display:inline-block;padding:13px 20px;border-radius:28px;background:#c92732;color:white;font-size:14px}.intro{display:flex;align-items:flex-end;justify-content:space-between;gap:5vw;padding-block:clamp(24px,4vh,60px)}h1{font:400 clamp(44px,5.7vw,105px)/.99 Georgia,serif;letter-spacing:-.064em;margin:0}.intro em{color:#ad2733}.intro p{max-width:34ch;font:400 clamp(16px,1.3vw,23px)/1.5 Arial;color:#575451;margin:0 2vw 5px 0}main{height:auto;overflow:hidden}.gallery{position:relative;height:clamp(200px,36svh,410px)}.frame{top:50%;height:94%;width:21vw}.frame video{width:146%;height:100%;left:-23%;object-fit:cover}footer{position:relative;inset:auto;margin:16px 5vw 36px;align-items:center}.person{max-width:45vw}.person small{min-height:2.7em}#lokacija{border-top:1px solid #ddd;display:flex;align-items:center;justify-content:space-between;padding-block:32px;gap:20px}#lokacija h2{font:400 clamp(25px,3vw,46px)/1.1 Georgia,serif;margin:0}#lokacija p{line-height:1.5}@media(max-width:680px){header{flex-wrap:wrap;gap:10px}header nav{order:3;width:100%;gap:20px;font-size:14px}.intro{display:block}.intro p{margin-top:15px}.gallery{height:clamp(220px,33svh,315px)}.frame{width:46vw}.person{max-width:100%}#lokacija{align-items:flex-start;flex-direction:column}}.gallery{height:clamp(340px,53svh,620px)}\n.frame{height:96%}\n.frame video{width:106%;left:-3%;object-position:50% 0%}\n.frame .person{position:absolute;bottom:0;left:0;z-index:2;width:100%;max-width:none;padding:48px 6% 22px;border:0;color:white;background:linear-gradient(transparent,rgba(15,13,12,.64) 48%,rgba(15,13,12,.88));text-align:left}\n.frame .person small{display:block;width:min(30vw,44ch);max-width:none;min-height:0;color:white;line-height:1.35}\n.frame .person i{color:#ffe4e3}.frame .person span{font-size:clamp(22px,2vw,34px)}\nfooter{display:grid;grid-template-columns:1fr auto 1fr}.arrows{grid-column:2}.count{grid-column:3}\n@media(max-width:680px){.gallery{height:clamp(305px,46svh,460px)}.frame .person small{width:62vw}.frame .person{padding-bottom:17px}}.gallery.soft-drag .frame{clip-path:url(#mask)}\n.float-nav[hidden]{display:none}.float-nav{position:fixed;z-index:1000;top:20px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;max-width:calc(100vw - 24px);font:500 14px/1.25 Arial,sans-serif}\n.float-nav nav{display:block;width:auto;order:0;background:#eee;border:1px solid #ddd;border-radius:14px;padding:5px;box-shadow:0 4px 16px #19141912}.float-links{display:flex;align-items:center}.float-links a,.float-nav button{display:block;padding:10px 13px;white-space:nowrap;border-radius:9px}.float-links a:hover{background:white;text-decoration:none}.float-nav .cta{display:grid;place-items:center;min-height:48px;padding:0 19px;border-radius:13px;white-space:nowrap}.float-nav button{display:none}\n@media(max-width:767px){.float-nav button{display:block;border:0;background:transparent;font:inherit}.float-nav .float-links{display:none}.float-nav nav.open .float-links{display:grid;position:absolute;top:calc(100% + 6px);left:0;background:#eee;border:1px solid #ddd;padding:6px;border-radius:12px}.float-nav .cta{min-height:42px}}\n\nheader nav,.float-nav nav{display:flex;align-items:center;gap:2px;background:#efefef;padding:5px;border:0;border-radius:14px;box-shadow:none}\nheader nav a{padding:10px 13px;font-size:14px;white-space:nowrap}\nheader nav .cta,.float-nav nav .cta{margin-left:4px;border-radius:10px;padding:10px 14px;min-height:0}\n.float-nav{opacity:0;visibility:hidden;pointer-events:none;transform:translate(-50%,-12px);transition:opacity .28s ease,transform .42s cubic-bezier(.22,1,.36,1),visibility 0s .42s}\n.float-nav.visible{visibility:visible;opacity:1;pointer-events:auto;transform:translate(-50%,0);transition-delay:0s}\n.float-nav nav,.float-nav nav a,.float-nav button{font-size:12px}.float-nav nav.open .float-links{border:0;box-shadow:none}\n.intro h1{margin:0;color:#483434;font-style:normal;font-weight:300;font-size:clamp(60px,5.4vw,84px);line-height:1.04;letter-spacing:-.045em;text-wrap:balance}\n.intro{display:grid;text-align:center;justify-content:center;justify-items:center;gap:22px;padding:clamp(32px,5vw,76px) 20px}\n.intro p{max-width:680px;margin:0;text-wrap:balance}\n.intro .mask{overflow:hidden;padding-bottom:.1em}.intro .mask>*{animation:intro-in .85s cubic-bezier(.22,1,.36,1) 1s backwards}.intro .mask+p{animation:intro-in .85s cubic-bezier(.22,1,.36,1) 1.08s backwards}\n@keyframes intro-in{from{opacity:0;transform:translateY(1em)}to{opacity:1;transform:translateY(0)}}\n@media(max-width:767px){header nav{flex-wrap:wrap;justify-content:center;width:auto;max-width:100%}header nav a{font-size:12px;padding:7px}.intro h1{font-size:clamp(42px,9vw,58px)}}\n@media(prefers-reduced-motion:reduce){.float-nav,.intro .mask>*,.intro .mask+p{transition:none;animation:none}}\n\nheader .nav-links{display:flex;align-items:center}header .burger{display:none}\nheader nav .cta:hover,.float-nav nav .cta:hover{text-decoration:none;background:#b51e2a;color:white}\n@media(max-width:767px){\nheader{flex-wrap:nowrap}header nav{position:relative;flex-wrap:nowrap}\nheader nav .burger,.float-nav nav .burger{display:grid;align-content:center;justify-items:center;gap:4px;width:44px;height:40px;padding:0;border:0;background:transparent;border-radius:9px}\n.burger span{display:block;width:18px;height:1.5px;background:#242424}\nheader nav .nav-links,.float-nav nav .nav-links{display:none}\nheader nav.open .nav-links,.float-nav nav.open .nav-links{display:grid;position:absolute;top:calc(100% + 6px);right:0;left:auto;width:max-content;min-width:180px;background:#efefef;border:0;border-radius:12px;padding:6px;z-index:3}\nheader{position:relative;z-index:2}header nav .nav-links a,.float-nav nav .nav-links a{padding:12px 14px;text-align:left}\n}\n</style><header id=\"pocetak\"><a class=\"logo\" href=\"#pocetak\" aria-label=\"Početna\"><img src=\"./assets/imgVector.png\" alt=\"Zavod za transfuziju krvi Vojvodine\"></a><nav aria-label=\"Glavna navigacija\"><button class=\"burger\" type=\"button\" aria-label=\"Meni\" aria-expanded=\"false\" aria-controls=\"header-links\"><span></span><span></span><span></span></button><div class=\"nav-links\" id=\"header-links\"><a href=\"#daj-krv\">Daj krv</a><a href=\"#lokacija\">Akcije i mesta</a><a href=\"#o-nama\">O nama</a><a href=\"#pitanja\">Pitanja i odgovori</a></div><a class=\"cta\" href=\"#lokacija\">Gde mogu da dam krv?</a></nav></header>\n<div class=\"float-nav\" inert><nav aria-label=\"Plutajuća navigacija\"><button class=\"burger\" type=\"button\" aria-label=\"Meni\" aria-expanded=\"false\" aria-controls=\"sticky-links\"><span></span><span></span><span></span></button><div class=\"float-links nav-links\" id=\"sticky-links\"><a href=\"#daj-krv\">Daj krv</a><a href=\"#lokacija\">Akcije i mesta</a><a href=\"#o-nama\">O nama</a><a href=\"#pitanja\">Pitanja i odgovori</a></div><a class=\"cta\" href=\"#lokacija\">Gde mogu da dam krv?</a></nav></div><section class=\"intro\"><div class=\"mask\"><h1>Svaka krvna grupa je važna. I tvoja.</h1></div><p>Već danas možeš da učiniš nešto veliko i postaneš tihi heroj za nekoga koga možda nikada nećeš upoznati.</p></section><main id=\"heroji\"><svg aria-hidden=\"true\"><defs><clipPath id=\"mask\" clipPathUnits=\"objectBoundingBox\"><path/></clipPath></defs></svg><div class=\"gallery\" aria-label=\"Portreti tihih heroja\"></div><footer><div class=\"person\"><i>Tihi heroji</i><span></span><small></small></div><div class=\"arrows\"><button aria-label=\"Prethodni portret\">←</button><button aria-label=\"Sledeći portret\">→</button></div><span class=\"count\"></span></footer><dialog><small>TIHI HEROJ</small><h2></h2><p></p><form method=\"dialog\"><button>Zatvori</button></form></dialog></main>";
  const intro=root.querySelector('.intro');
  const bar=root.querySelector('.float-nav');
  const burgers=[...root.querySelectorAll('.burger')];
  function closeMenu(){for(const btn of burgers){btn.closest('nav').classList.remove('open');btn.setAttribute('aria-expanded','false')}}
  for(const btn of burgers)btn.onclick=()=>{const open=btn.getAttribute('aria-expanded')==='false';closeMenu();btn.closest('nav').classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))};
  document.addEventListener('keydown',e=>{const open=burgers.find(b=>b.getAttribute('aria-expanded')==='true');if(e.key==='Escape'&&open){closeMenu();open.focus()}},{signal});
  document.addEventListener('pointerdown',e=>{if(!burgers.some(b=>e.composedPath().includes(b.closest('nav'))))closeMenu()},{signal});
  matchMedia('(max-width:767px)').addEventListener('change',closeMenu,{signal});
  queueMicrotask(()=>{
    if(signal.aborted)return;
    const find=(a,b)=>document.querySelector('[data-node-id="'+a+'"],[data-node-id="'+b+'"]');
    const first=find('503:204','351:1090');
    const ref=first?.querySelectorAll('p');
    if(ref?.length>=2){
      Array.from(intro.querySelectorAll('h1,p')).forEach((el,i)=>{
        const css=getComputedStyle(ref[i]);
        for(const prop of ['font-family','font-size','font-weight','font-variation-settings','line-height','letter-spacing','opacity','color']){if(i===1 || !['font-size','line-height','letter-spacing'].includes(prop))el.style.setProperty(prop,css.getPropertyValue(prop))};
        el.style.margin='0';el.style.textWrap='balance';
      });
    }
    if(first)first.id='daj-krv';
    const about=find('503:276','351:1156');if(about)about.id='o-nama';
    const faq=find('503:381','351:1260');if(faq)faq.id='pitanja';
    for(const id of ['daj-krv','lokacija','o-nama','pitanja']){const el=document.getElementById(id);if(el)el.style.scrollMarginTop='84px'}
  });
  const updateBar=()=>{const visible=scrollY>Math.max(innerHeight*.85,this.getBoundingClientRect().height);if(bar.classList.contains('visible')!==visible)closeMenu();bar.classList.toggle('visible',visible);bar.inert=!visible};
  updateBar();window.addEventListener('scroll',updateBar,{passive:true,signal});window.addEventListener('resize',updateBar,{signal});
  root.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');if(!link)return;
    const id=link.hash.slice(1), section=root.getElementById(id)||document.getElementById(id);
    if(section){closeMenu();event.preventDefault();section.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
  },{signal});
  
const photos=["./assets/hero-clips/1.mp4","./assets/hero-clips/2.mp4","./assets/hero-clips/3.mp4","./assets/hero-clips/4.mp4","./assets/hero-clips/5.mp4"];const names=['Marija','Milica','Nikola','Jelena','Stefan'];
const counts=[7,20,14,8,9];
const reasons=['Posle svog prvog davanja ohrabrila je koleginicu da pođe s njom.','Na akciju u svom kraju dovela je još troje davalaca.','Na sledeću akciju poveo je prijatelja koji se dugo premišljao.','Danas prati nove davaoce na njihovo prvo davanje krvi.','Sa kolegama je organizovao zajednički odlazak na davanje krvi.'];
const q=s=>root.querySelector(s), gallery=q('.gallery'),dialog=q('dialog');
const cards=photos.map((src,i)=>{const frame=document.createElement('div'),img=document.createElement('video');frame.className='frame';img.muted=true;img.defaultMuted=true;img.loop=true;img.playsInline=true;img.preload="auto";img.setAttribute('aria-label',names[i]);img.src=src;img.draggable=false;frame.append(img);gallery.append(frame);return {frame,img}});
const mod=x=>(x%cards.length+cards.length)%cards.length;
const less=matchMedia('(prefers-reduced-motion:reduce)');
let pos=2,target=2,held=null,x=0,velocity=0,last=performance.now(),stamp=0,active=-1,width=1,step=1;
function measure(){width=innerWidth*(innerWidth<=680?.46:.21);step=width+Math.max(10,Math.min(22,innerWidth*.012))}
function move(n){velocity=0;target=Math.round(target)+n}
root.querySelectorAll('.arrows button').forEach((b,i)=>b.onclick=()=>move(i?1:-1));
document.addEventListener('keydown',e=>{if(dialog.open)return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}},{signal});

gallery.onpointerdown=e=>{if(e.target.closest('button'))return;if(e.button!==0||!e.isPrimary)return;held=e.pointerId;x=e.clientX;stamp=performance.now();target=pos;velocity=0;gallery.setPointerCapture(held)};
gallery.onpointermove=e=>{if(e.pointerId!==held)return;const now=performance.now(),delta=(x-e.clientX)/step;target+=delta;velocity=Math.max(-.007,Math.min(.007,delta/Math.max(8,now-stamp)));x=e.clientX;stamp=now};
gallery.onlostpointercapture=()=>{held=null;if(performance.now()-stamp>100)velocity=0};
const clip=q('#mask path');let curl=0;
function paint(now){const dt=Math.min(40,now-last);last=now;
 if(!dialog.open){if(held===null){if(!less.matches){target+=dt*(.000047+velocity);velocity*=Math.exp(-dt/115)}else velocity=0}pos+=(target-pos)*(less.matches?1:1-Math.exp(-dt/(held===null?85:32)))}
 const dragging=held!==null && now-stamp<=90;
 const speed=dragging?Math.min(1,Math.abs(velocity)*step/.9):0;
 const goal=less.matches || !dragging || speed===0 ? 0 : 2+7*Math.sqrt(speed);
 curl+=(goal-curl)*(1-Math.exp(-dt/(goal>curl?55:95)));
 if(curl>.04){
   gallery.classList.add('soft-drag');
   const a=curl/Math.max(width,1), b=curl/Math.max(gallery.clientHeight*.96,1);
   const rx=16/Math.max(width,1), ry=16/Math.max(gallery.clientHeight*.96,1);
   clip.setAttribute('d',`M ${rx} ${b} Q .5 ${-b} ${1-rx} ${b} Q ${1-a} ${b} ${1-a} ${ry} Q ${1+a} .5 ${1-a} ${1-ry} Q ${1-a} ${1-b} ${1-rx} ${1-b} Q .5 ${1+b} ${rx} ${1-b} Q ${a} ${1-b} ${a} ${1-ry} Q ${-a} .5 ${a} ${ry} Q ${a} ${b} ${rx} ${b} Z`);
 }else gallery.classList.remove('soft-drag');
 const next=mod(Math.round(pos));
 if(next!==active){
   if(active>=0){const previous=cards[active].img;previous.pause();previous.currentTime=0}
   active=next; cards[active].frame.append(q('.person'));
   cards[active].img.play().catch(()=>{});
   q('.person span').textContent=names[next];
   q('.person small').textContent=counts[next]+' davanja krvi · '+reasons[next];
   q('.count').textContent=String(next+1).padStart(2,'0')+' / 05';
 }
 const nearest=Math.round(pos),extra=width*(innerWidth<=680?.65:.82);
 const widths=cards.map((card,i)=>{
   card.focus=(card.focus||0)+((i===active?1:0)-(card.focus||0))*(less.matches?1:1-Math.exp(-dt/135));
   return width+extra*card.focus;
 });
 const span=(n)=>widths[mod(n)];
 const gap=step-width;
 cards.forEach(({frame,img},i)=>{
   const d=mod(i-nearest+2)-2;
   let center=0;
   for(let n=0;n<Math.abs(d);n++){const k=nearest+Math.sign(d)*n;center+=Math.sign(d)*(gap+(span(k)+span(k+Math.sign(d)))/2)}
   const progress=pos-nearest;
   center-=progress*(gap+(span(nearest)+span(nearest+Math.sign(progress)))/2);
   frame.style.width=widths[i]+'px';
   frame.style.transform='translate(-50%,-50%) translateX('+center+'px)';
   img.style.transform='translateX('+(-Math.tanh(center/step*.85)*2)+'%)';
 });this.frameId=requestAnimationFrame(paint)}
measure();window.addEventListener('resize',measure,{signal});this.frameId=requestAnimationFrame(paint);

 }
 disconnectedCallback(){cancelAnimationFrame(this.frameId);this.controller.abort();this.shadowRoot.querySelectorAll('video').forEach(v=>v.pause());}
}
customElements.define('donor-video-hero',DonorVideoHero);
