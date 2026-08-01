(function () {
  var langToggle = document.getElementById('langToggle');
  var current = 'cz';

  function applyLang(lang) {
    current = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-cz]').forEach(function (el) {
      var value = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-cz');
      if (value !== null) el.innerHTML = value;
    });
    langToggle.querySelectorAll('.lang-opt').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
  }

  langToggle.addEventListener('click', function () {
    applyLang(current === 'cz' ? 'en' : 'cz');
  });

  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function closeNav() {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Opening-hours logic: café Mon-Fri 8-19, Sat 8:30-15, Sun closed
  var schedule = {
    0: null,
    1: [8 * 60, 19 * 60],
    2: [8 * 60, 19 * 60],
    3: [8 * 60, 19 * 60],
    4: [8 * 60, 19 * 60],
    5: [8 * 60, 19 * 60],
    6: [8 * 60 + 30, 15 * 60],
  };

  function updateOpenStatus() {
    var now = new Date();
    var day = now.getDay();
    var minutes = now.getHours() * 60 + now.getMinutes();
    var todayRange = schedule[day];
    var isOpen = todayRange && minutes >= todayRange[0] && minutes < todayRange[1];

    var statusEl = document.getElementById('heroOpenStatus');
    if (statusEl) {
      statusEl.textContent = isOpen
        ? (current === 'en' ? 'Open now' : 'Otevřeno')
        : (current === 'en' ? 'Closed' : 'Zavřeno');
    }

    var row = document.querySelector('#cafeHours tr[data-day="' + day + '"]');
    if (row) row.classList.add('today');
  }

  var origApplyLang = applyLang;
  applyLang = function (lang) {
    origApplyLang(lang);
    updateOpenStatus();
  };

  updateOpenStatus();
})();
