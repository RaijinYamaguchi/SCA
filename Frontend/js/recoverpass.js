/* ── recoverpass.js ── */

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('recoverForm');
  const msgDiv    = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const email = document.getElementById('email').value.trim();

    if (!email) {
      showMessage('Ingresa tu correo electrónico.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage('Ingresa un correo válido.', 'error');
      document.getElementById('email').classList.add('error-field');
      return;
    }

    setLoading(true);

    try {
      await Auth.recoverPassword(email);
      showMessage(
        `Hemos enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`,
        'success'
      );
      form.style.display = 'none';
    } catch (error) {
      showMessage(error.message || 'No encontramos esa cuenta.', 'error');
      setLoading(false);
    }
  });

  document.getElementById('email').addEventListener('input', () => {
    document.getElementById('email').classList.remove('error-field');
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setLoading(state) {
    submitBtn.disabled    = state;
    submitBtn.textContent = state ? 'Enviando…' : 'Enviar enlace de recuperación';
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