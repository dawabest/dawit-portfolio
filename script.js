'use strict';

// Mobile navigation
const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
function closeMenu(){if(!menuToggle||!navLinks)return;navLinks.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');}
if(menuToggle&&navLinks){
  menuToggle.addEventListener('click',()=>{
    const open=menuToggle.getAttribute('aria-expanded')!=='true';
    menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    navLinks.classList.toggle('open',open);
  });
  navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  window.addEventListener('resize',()=>{if(window.innerWidth>700)closeMenu();});
}

// Theme preference
const themeToggle=document.querySelector('#themeToggle');
function applyTheme(theme){
  const light=theme==='light';
  document.body.classList.toggle('light-mode',light);
  if(themeToggle){themeToggle.textContent=light?'☾':'☼';themeToggle.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');}
}
let theme='dark';
try{const saved=localStorage.getItem('portfolio-theme');if(saved==='light'||saved==='dark')theme=saved;}catch(error){console.info('Theme storage unavailable.');}
applyTheme(theme);
themeToggle?.addEventListener('click',()=>{
  theme=document.body.classList.contains('light-mode')?'dark':'light';applyTheme(theme);
  try{localStorage.setItem('portfolio-theme',theme);}catch(error){console.info('Theme preference could not be saved.');}
});

// Scroll reveal
const revealItems=document.querySelectorAll('.reveal');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver'in window&&!reducedMotion){
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
  },{threshold:.12});
  revealItems.forEach(item=>revealObserver.observe(item));
}else{revealItems.forEach(item=>item.classList.add('visible'));}

// Active navigation section
const sections=document.querySelectorAll('main section[id]');
const sectionLinks=document.querySelectorAll('.nav-link');
if('IntersectionObserver'in window){
  const sectionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      sectionLinks.forEach(link=>{
        const active=link.getAttribute('href')===`#${entry.target.id}`;
        link.classList.toggle('active',active);
        if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
      });
    });
  },{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(section=>sectionObserver.observe(section));
}

// Contact: validates and opens the visitor's email application (does not send automatically)
const contactForm=document.querySelector('#contactForm');
const formMessage=document.querySelector('#formMessage');
contactForm?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!contactForm.checkValidity()){contactForm.reportValidity();return;}
  const data=new FormData(contactForm);
  const name=String(data.get('name')||'').trim();
  const email=String(data.get('email')||'').trim();
  const message=String(data.get('message')||'').trim();
  const subject=encodeURIComponent(`Portfolio message from ${name}`);
  const body=encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  if(formMessage){formMessage.textContent='Your email app should open with the message prepared. Review it and press Send.';formMessage.classList.add('success');}
  window.location.href=`mailto:dawittedros121@gmail.com?subject=${subject}&body=${body}`;
});

// Footer year
const yearElement=document.querySelector('#year');
if(yearElement)yearElement.textContent=new Date().getFullYear();
