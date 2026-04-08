const sections=[...document.querySelectorAll('.screen')];
const navButtons=[...document.querySelectorAll('[data-target]')];
const hitboxes=[...document.querySelectorAll('.nav-hitbox')];

function activate(targetId){
  sections.forEach(section=>section.classList.toggle('hidden', section.id!==targetId));
  navButtons.forEach(btn=>btn.classList.toggle('active', btn.dataset.target===targetId));
  hitboxes.forEach(box=>{
    const boxTarget=box.querySelector('[data-target]')?.dataset.target;
    box.classList.toggle('active', boxTarget===targetId);
  });
  if(history.replaceState){ history.replaceState(null,'',`#${targetId}`); }
}
navButtons.forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.preventDefault();
    const targetId=btn.dataset.target;
    if(targetId) activate(targetId);
  });
});
const initial=location.hash.replace('#','') || 'home';
activate(document.getElementById(initial)? initial : 'home');