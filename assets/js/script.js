function select(q, c) { return (c || document).querySelector(q); }
function selectAll(q, c) { return Array.from((c || document).querySelectorAll(q)); }
var navToggle = select('.nav-toggle');
var navList = select('.nav-list');
var themeToggle = select('#themeToggle');
var backToTop = select('#backToTop');
var header = select('.site-header');
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
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
    l.setAttribute('aria-current', match ? 'page' : 'false');
  });
  if (backToTop) backToTop.style.display = window.scrollY > 300 ? 'inline-flex' : 'none';
  if (header) header.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

var form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var hp = form.querySelector('input[name=\"website\"]');
    if (hp && hp.value) return;
    var name = (document.getElementById('name') || {}).value || '';
    var email = (document.getElementById('email') || {}).value || '';
    var message = (document.getElementById('message') || {}).value || '';
    var statusEl = document.getElementById('formStatus');
    if (!name || !email || !message) {
      if (statusEl) statusEl.textContent = 'Please complete all fields.';
      return;
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      if (statusEl) statusEl.textContent = 'Please enter a valid email address.';
      return;
    }
    var body = encodeURIComponent('Name: ' + name + '\\nEmail: ' + email + '\\n\\n' + message);
    var mailto = 'mailto:?subject=' + encodeURIComponent('Portfolio contact from ' + name) + '&body=' + body;
    window.location.href = mailto;
    if (statusEl) statusEl.textContent = 'Thanks! Opening your email client to send the message.';
    form.reset();
  });
}
