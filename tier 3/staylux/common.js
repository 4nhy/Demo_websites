const nav = document.getElementById("navbar");
if(nav){ window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 40)); }

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); });
}, {threshold:0.15});
document.querySelectorAll(".feature-row").forEach(el => io.observe(el));

const popObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); });
}, {threshold:0.25});
document.querySelectorAll(".cat-tile, .card").forEach(el => popObserver.observe(el));

const heroWrap = document.getElementById("heroWrap");
if(heroWrap){ requestAnimationFrame(() => heroWrap.classList.add("loaded")); }

const watermark = document.getElementById("watermark");
const heroText = document.getElementById("heroText");
if(watermark || heroText){
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if(watermark) watermark.style.transform = `translateX(-50%) translateY(${y*0.3}px)`;
    if(heroText) heroText.style.transform = `translateY(${y*-0.08}px)`;
  });
}
const pageHeroBg = document.getElementById("pageHeroBg");
if(pageHeroBg){
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    pageHeroBg.style.transform = `scale(${1+Math.min(y/2500,0.06)}) translateY(${y*0.12}px)`;
  });
}
const sectionBgs = document.querySelectorAll(".section-bg-img");
if(sectionBgs.length){
  window.addEventListener("scroll", () => {
    sectionBgs.forEach(bg => {
      const rect = bg.closest("section").getBoundingClientRect();
      bg.style.transform = `translateY(${rect.top * 0.1}px)`;
    });
  });
}
document.querySelectorAll(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.25}px, ${y*0.25}px)`;
  });
  btn.addEventListener("mouseleave", () => btn.style.transform = "translate(0,0)");
});
function openModal(id){ const m = document.getElementById(id); if(m) m.classList.add("active"); }
function closeModal(id){ const m = document.getElementById(id); if(m) m.classList.remove("active"); }
document.querySelectorAll(".modal-backdrop").forEach(m => {
  m.addEventListener("click", (e) => { if(e.target === m) m.classList.remove("active"); });
});
const signInForm = document.getElementById("signInForm");
if(signInForm){
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("signInMsg").style.display = "block";
    setTimeout(() => closeModal("signInModal"), 1200);
  });
}
