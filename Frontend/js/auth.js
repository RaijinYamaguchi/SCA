const API_BASE_URL = 'http://localhost:3000';

class Auth {
  static async register(email, password, passwordConfirm) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, passwordConfirm })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      return data;
    } catch (error) {
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getUserId() {
    return localStorage.getItem('userId');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static async recoverPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Recovery failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Redirect to login if not authenticated
function checkAuth() {
  if (!Auth.isAuthenticated() && !window.location.pathname.includes('login') && !window.location.pathname.includes('registro')) {
    window.location.href = 'login.html';
  }
}
