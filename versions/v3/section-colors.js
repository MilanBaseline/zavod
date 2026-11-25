(() => {
  const root = document.getElementById('root');
  let page, sections = [], pending = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function color(el) {
    const rgba = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number);
    return rgba && rgba.length >= 3 && rgba[3] !== 0 ? rgba.slice(0, 3) : null;
  }
  function paint() {
    pending = false;
    if (!sections.length) return;
    // Treat the lower viewport as the entry zone; CSS finishes each transition.
    const entry = innerHeight * .90;
    let active = sections[0];
    for (const section of sections.slice(1)) {
      if (section.el.getBoundingClientRect().top > entry) break;
      active = section;
    }
    const target = 'rgb(' + active.rgb.join(',') + ')';
    if (page.style.getPropertyValue('--scroll-canvas') !== target)
      page.style.setProperty('--scroll-canvas', target);
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(paint); }
  }
  function bind() {
    const next = root.firstElementChild;
    if (!next || next === page) return;
    page = next;
    const base = color(page) || color(document.body);
    sections = [...page.children].map(el => {
      const surface = el.querySelector('.ck-stage') || el;
      const rgb = color(surface) || base;
      el.dataset.scrollSurface = '';
      surface.dataset.scrollSurface = '';
      const panel = el.querySelector('[data-node-id="503:246"]');
      if (panel) panel.dataset.scrollSurface = '';
      return {el, rgb};
    });
    page.dataset.scrollCanvas = '';
    paint();
  }
  new MutationObserver(bind).observe(root, {childList:true});
  bind();
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  reduced.addEventListener('change', schedule);
})();

(() => {
  const root=document.getElementById('root');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let stage, timer, frame, running=false, entered=false, lastY=scrollY;
  let pinY=0, setupFrame=0, touchY=null;
  const anchor=()=>scrollY+stage.parentElement.getBoundingClientRect().top;
  function release(){
    clearTimeout(timer);
    cancelAnimationFrame(setupFrame);
    if(running)stage?.classList.toggle('ck-entered',entered);
    running=false;
    document.documentElement.classList.remove('ck-hold');
    lastY=scrollY;
  }
  function play(reverse){
    if(running)return;
    pinY=Math.round(anchor());
    running=true;
    entered=!reverse;
    document.documentElement.classList.add('ck-hold');
    window.scrollTo({top:pinY,behavior:'instant'});
    lastY=pinY;
    if(reduced.matches){release();return}
    // Paint the pinned frame before starting any reveal.
    setupFrame=requestAnimationFrame(()=>{
      setupFrame=requestAnimationFrame(()=>{
        if(!running)return;
        stage.classList.add('ck-entered');
        const animations=stage.getAnimations({subtree:true}).filter(a=>
          ['ck-open','ck-uncover','ck-draw','ck-copy'].includes(a.animationName));
        const duration=1800;
        for(const animation of animations){
          animation.effect.updateTiming({fill:'both'});
          animation.pause();
          animation.currentTime=reverse?duration:0;
          animation.playbackRate=reverse?-1:1;
          animation.play();
        }
        timer=setTimeout(release,duration);
      });
    });
  }
  function crosses(from,to,y){
    return (!entered && to>from && from<=y+1 && to>=y)
      || (entered && to<from && from>=y-1 && to<=y);
  }
  function intercept(event,delta){
    if(!stage || reduced.matches || !event.cancelable)return;
    if(running){event.preventDefault();return}
    if(crosses(scrollY,scrollY+delta,anchor())){
      event.preventDefault();
      play(delta<0);
    }
  }
  addEventListener('wheel',event=>{
    if(event.ctrlKey || Math.abs(event.deltaY)<Math.abs(event.deltaX))return;
    const unit=event.deltaMode===1?16:event.deltaMode===2?innerHeight:1;
    intercept(event,event.deltaY*unit);
  },{passive:false});
  addEventListener('touchstart',event=>{touchY=event.touches.length===1?event.touches[0].clientY:null},{passive:true});
  addEventListener('touchmove',event=>{
    if(touchY===null || event.touches.length!==1)return;
    const y=event.touches[0].clientY;
    intercept(event,touchY-y);
    touchY=y;
  },{passive:false});
  function check(){
    frame=0;
    if(!stage)return;
    if(running){
      if(Math.abs(scrollY-pinY)>1)window.scrollTo({top:pinY,behavior:'instant'});
      return;
    }
    const y=scrollY,previous=lastY;
    lastY=y;
    if(crosses(previous,y,anchor()))play(y<previous);
    else if(stage.parentElement.getBoundingClientRect().bottom<=0){
      entered=true;stage.classList.add('ck-entered');
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(check)}
  function bind(){
    const next=root.querySelector('.ck-stage');
    if(next===stage)return;
    release();stage=next;entered=false;lastY=scrollY;if(!stage)return;
    stage.querySelectorAll('.ck-out').forEach((img,i)=>{
      img.parentElement.classList.add('ck-photo');
      img.parentElement.style.setProperty('--delay',(.44+i*.14)+'s');
    });
    if(!stage.querySelector('.w-px')){
      for(const [x,y] of [['20px',null],['calc(100% - 120px)',null],[null,'12%'],[null,'72%']]){
        const line=document.createElement('div');
        line.setAttribute('aria-hidden','true');
        line.className=x?'w-px':'h-px';
        line.style.cssText='position:absolute;background:rgba(195,195,195,.3);pointer-events:none;'+(x?'top:0;bottom:0;width:1px;left:'+x:'left:0;right:0;height:1px;top:'+y);
        stage.prepend(line);
      }
    }
    stage.querySelectorAll(':scope > .w-px,:scope > .h-px').forEach((line,i)=>{
      line.classList.add('ck-line',line.classList.contains('w-px')?'ck-v':'ck-h');
      line.style.setProperty('--delay',(.18+i*.09)+'s');
    });
    schedule();
  }
  new MutationObserver(bind).observe(root,{childList:true});
  bind();
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  addEventListener('pagehide',release);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')release()});
  document.addEventListener('click',e=>{if(e.composedPath().some(el=>el.tagName==='A'))release()},true);
})();


