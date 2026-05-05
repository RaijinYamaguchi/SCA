const API_BASE_URL = 'http://localhost:3000';

class API {
  static getHeaders() {
    const token = Auth.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async fetchWithAuth(endpoint, options = {}) {
    const headers = this.getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers }
    });

    if (response.status === 401) {
      Auth.logout();
      window.location.href = 'login.html';
    }

    return response;
  }

  // Meters endpoints
  static async getMeters() {
    const response = await this.fetchWithAuth('/meters');
    if (!response.ok) throw new Error('Failed to fetch meters');
    return response.json();
  }

  static async getMeter(id) {
    const response = await this.fetchWithAuth(`/meters/${id}`);
    if (!response.ok) throw new Error('Failed to fetch meter');
    return response.json();
  }

  static async createMeter(name, location) {
    const response = await this.fetchWithAuth('/meters', {
      method: 'POST',
      body: JSON.stringify({ name, location })
    });
    if (!response.ok) throw new Error('Failed to create meter');
    return response.json();
  }

  static async updateMeter(id, name, location) {
    const response = await this.fetchWithAuth(`/meters/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, location })
    });
    if (!response.ok) throw new Error('Failed to update meter');
    return response.json();
  }

  static async deleteMeter(id) {
    const response = await this.fetchWithAuth(`/meters/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete meter');
    return response.json();
  }

  // Readings endpoints
  static async getReadings(meterId) {
    const response = await this.fetchWithAuth(`/meters/${meterId}/readings`);
    if (!response.ok) throw new Error('Failed to fetch readings');
    return response.json();
  }

  static async addReading(meterId, value, readingDate = null) {
    const response = await this.fetchWithAuth(`/meters/${meterId}/readings`, {
      method: 'POST',
      body: JSON.stringify({ value, readingDate })
    });
    if (!response.ok) throw new Error('Failed to add reading');
    return response.json();
  }
}
