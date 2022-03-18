var storedTheme =
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light');
if (storedTheme)
  document.documentElement.setAttribute('data-theme', storedTheme);
