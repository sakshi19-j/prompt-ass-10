// Shared interactions used by every page.
document.addEventListener('DOMContentLoaded', function () {
  setupMobileMenu();
  setupTheme();
  highlightActiveLink();
});

// Opens and closes the navigation on small screens.
function setupMobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var navigation = document.querySelector('.site-nav');
  if (!toggle || !navigation) return;
  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });
  navigation.addEventListener('click', function (event) {
    if (event.target.matches('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    }
  });
}

// Applies the saved colour theme and remembers future user choices.
function setupTheme() {
  var button = document.querySelector('.theme-toggle');
  var storedTheme = localStorage.getItem('placeprep-theme');
  if (storedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  if (!button) return;
  updateThemeLabel(button);
  button.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('placeprep-theme', isDark ? 'light' : 'dark');
    updateThemeLabel(button);
  });
}

// Keeps the theme control understandable to screen readers.
function updateThemeLabel(button) {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  button.querySelector('.theme-icon').textContent = isDark ? '\u2600' : '\u263e';
}

// Marks the navigation item that matches the current page.
function highlightActiveLink() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var isCurrent = link.getAttribute('href') === page;
    link.classList.toggle('active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
  });
}
