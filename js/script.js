window.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const loginScreen = document.getElementById('login-screen');

  setTimeout(() => {
    splashScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
  }, 3000);
});
