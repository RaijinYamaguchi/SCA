/* ── login.js ── */

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('loginForm');
  const msgDiv    = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showMessage('Por favor completa todos los campos.', 'error');
      return;
    }

    setLoading(true);

    try {
      await Auth.login(email, password);
      showMessage('Acceso correcto. Redirigiendo…', 'success');
      setTimeout(() => { window.location.href = 'Dashboard.html'; }, 1200);
    } catch (error) {
      showMessage(error.message || 'Credenciales incorrectas.', 'error');
      setLoading(false);
    }
  });

  function setLoading(state) {
    submitBtn.disabled    = state;
    submitBtn.textContent = state ? 'Verificando…' : 'Iniciar sesión';
  }

  function showMessage(text, type) {
    msgDiv.textContent = text;
    msgDiv.className   = `auth-message ${type}`;
  }

  function clearMessage() {
    msgDiv.textContent = '';
    msgDiv.className   = 'auth-message';
  }
});