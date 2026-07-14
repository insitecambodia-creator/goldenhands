// Golden Hands Massage & Spa — Kampot

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var burger = document.getElementById('burger');
  var nav = document.getElementById('siteNav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Menu tab switching
  var tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      document.querySelectorAll('.menu-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.id === 'panel-' + target);
      });
    });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
});
