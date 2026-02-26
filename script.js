function select(q, c) { return (c || document).querySelector(q); }
function selectAll(q, c) { return Array.from((c || document).querySelectorAll(q)); }
var navToggle = select('.nav-toggle');
var navList = select('.nav-list');
var themeToggle = select('#themeToggle');
var backToTop = select('#backToTop');
function setTheme(mode) {
  if (mode === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', mode);
  if (themeToggle) themeToggle.textContent = mode === 'light' ? '☀' : '🌙';
}
var savedTheme = localStorage.getItem('theme');
if (savedTheme) setTheme(savedTheme);
else setTheme('dark');
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') ? 'light' : 'dark';
    setTheme(current === 'light' ? 'dark' : 'light');
  });
}
if (navToggle && navList) {
  navToggle.textContent = '≡';
  navToggle.addEventListener('click', function () {
    var open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  selectAll('.nav-list a').forEach(function (a) {
    a.addEventListener('click', function () {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
selectAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var el = select(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
var sections = selectAll('main section[id]');
var navLinks = selectAll('.nav-list a');
function onScroll() {
  var fromTop = window.scrollY + 100;
  var current = sections.find(function (s) { return s.offsetTop <= fromTop && s.offsetTop + s.offsetHeight > fromTop; });
  navLinks.forEach(function (l) {
    var href = l.getAttribute('href');
    var match = current && href === '#' + current.id;
    l.classList.toggle('active', !!match);
  });
  if (backToTop) backToTop.style.display = window.scrollY > 300 ? 'inline-flex' : 'none';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
