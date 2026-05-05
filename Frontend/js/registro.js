/* ── registro.js ── */

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('registroForm');
  const msgDiv    = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const passInput = document.getElementById('password');
  const bars      = document.querySelectorAll('.strength-bar');
  const label     = document.getElementById('strengthLabel');

  /* ── Indicador de fortaleza de contraseña ── */
  passInput.addEventListener('input', () => {
    const score = passwordScore(passInput.value);
    updateStrengthUI(score);
  });

  function passwordScore(pwd) {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8)               score++;
    if (/[A-Z]/.test(pwd))             score++;
    if (/[0-9]/.test(pwd))             score++;
    if (/[^A-Za-z0-9]/.test(pwd))      score++;
    return score;
  }

  const levels = [
    { text: '',        cls: '' },
    { text: 'Débil',   cls: 'active-weak' },
    { text: 'Regular', cls: 'active-fair' },
    { text: 'Buena',   cls: 'active-good' },
    { text: 'Fuerte',  cls: 'active-strong' },
  ];

  function updateStrengthUI(score) {
    bars.forEach((bar, i) => {
      bar.className = 'strength-bar';
      if (i < score) bar.classList.add(levels[score].cls);
    });
    label.textContent = levels[score].text;
    label.style.color = score <= 1 ? '#e05c4b'
                      : score === 2 ? '#f0a030'
                      : score === 3 ? '#4aadcf'
                      : 'var(--c-accent)';
  }

  /* ── Submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const nombre   = document.getElementById('nombre').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = passInput.value;
    const confirm  = document.getElementById('confirmPassword').value;

    if (!nombre || !email || !password || !confirm) {
      showMessage('Por favor completa todos los campos.', 'error');
      return;
    }

    if (password !== confirm) {
      showMessage('Las contraseñas no coinciden.', 'error');
      document.getElementById('confirmPassword').classList.add('error-field');
      return;
    }

    if (passwordScore(password) < 2) {
      showMessage('Elige una contraseña más segura.', 'error');
      return;
    }

    setLoading(true);

    try {
      await Auth.register(nombre, email, password);
      showMessage('¡Cuenta creada! Redirigiendo…', 'success');
      setTimeout(() => { window.location.href = 'Dashboard.html'; }, 1400);
    } catch (error) {
      showMessage(error.message || 'Error al crear la cuenta.', 'error');
      setLoading(false);
    }
  });

  /* Limpiar error en confirmPassword al escribir */
  document.getElementById('confirmPassword').addEventListener('input', () => {
    document.getElementById('confirmPassword').classList.remove('error-field');
  });

  function setLoading(state) {
    submitBtn.disabled    = state;
    submitBtn.textContent = state ? 'Creando cuenta…' : 'Crear cuenta';
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