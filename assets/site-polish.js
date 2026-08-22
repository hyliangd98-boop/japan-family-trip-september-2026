(()=>{
  const body=document.body;
  if(!body)return;
  if(!document.querySelector('.skip-link')){
    const skip=document.createElement('a');
    skip.className='skip-link';skip.href='#main-content';skip.textContent='跳到主要內容';
    body.prepend(skip);
  }
  const main=document.querySelector('main');
  if(main&&!main.id)main.id='main-content';
  const nav=document.querySelector('.site-switch');
  if(nav){
    if(!nav.getAttribute('aria-label'))nav.setAttribute('aria-label','網站主要導覽');
    const current=(location.pathname.split('/').pop()||'index.html').replace(/^$/,'index.html');
    let active=null;
    nav.querySelectorAll('a').forEach(a=>{
      const raw=a.getAttribute('href')||'';
      const page=raw==='./'?'index.html':raw.split('#')[0].split('/').pop();
      const onPage=page===current;
      a.classList.toggle('active',onPage);
      if(onPage){a.setAttribute('aria-current','page');active=a}else a.removeAttribute('aria-current');
    });
    requestAnimationFrame(()=>active?.scrollIntoView({block:'nearest',inline:'center'}));
  }
  document.querySelectorAll('a[target="_blank"]').forEach(a=>a.setAttribute('rel','noopener noreferrer'));
  document.querySelectorAll('button.filter,button.tab,button[data-people]').forEach(button=>{
    button.type='button';button.setAttribute('aria-pressed',String(button.classList.contains('active')));
    button.addEventListener('click',()=>requestAnimationFrame(()=>{
      const group=button.parentElement?.querySelectorAll('button.filter,button.tab,button[data-people]')||[];
      group.forEach(item=>item.setAttribute('aria-pressed',String(item.classList.contains('active'))));
    }));
  });
  [...document.images].forEach((img,index)=>{
    if(index>1&&!img.hasAttribute('loading'))img.loading='lazy';
    img.decoding='async';
    img.addEventListener('error',()=>{img.classList.add('image-unavailable');img.setAttribute('aria-label',(img.alt||'圖片')+'（載入失敗）')},{once:true});
  });
  let back=document.querySelector('.back-top');
  if(!back){back=document.createElement('button');back.className='back-top';back.type='button';back.textContent='↑ 回到最上方';body.append(back)}
  back.setAttribute('aria-label','回到頁面最上方');
  if(!back.dataset.sitePolished){
    back.dataset.sitePolished='true';
    const update=()=>back.classList.toggle('show',scrollY>600);
    addEventListener('scroll',update,{passive:true});update();
    back.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  }
})();
