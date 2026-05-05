class Dashboard {
  constructor() {
    this.meters = [];
    this.currentMeterId = null;
    this.chart = null;
  }

  async init() {
    checkAuth();
    await this.loadMeters();
    this.setupEventListeners();
  }

  async loadMeters() {
    try {
      this.meters = await API.getMeters();
      this.renderMeterSelector();

      if (this.meters.length > 0) {
        this.currentMeterId = this.meters[0].id;
        await this.loadMeterData(this.currentMeterId);
      }
    } catch (error) {
      console.error('Error loading meters:', error);
      this.showError('Error loading meters');
    }
  }

  renderMeterSelector() {
    const selector = document.getElementById('meterSelector');
    if (!selector) return;

    selector.innerHTML = '';
    this.meters.forEach(meter => {
      const option = document.createElement('option');
      option.value = meter.id;
      option.textContent = meter.name;
      selector.appendChild(option);
    });
  }

  async loadMeterData(meterId) {
    try {
      const readings = await API.getReadings(meterId);
      this.renderConsumption(readings);
      this.renderReadings(readings);
      this.renderChart(readings);
    } catch (error) {
      console.error('Error loading meter data:', error);
      this.showError('Error loading meter data');
    }
  }

  renderConsumption(readings) {
    const container = document.getElementById('consumptionData');
    if (!container) return;

    if (readings.length === 0) {
      container.innerHTML = '<p>No readings yet</p>';
      return;
    }

    const lastReading = readings[0];
    const firstReading = readings[readings.length - 1];
    const totalConsumption = lastReading.value - firstReading.value;
    const avgDaily = readings.length > 1 ? (totalConsumption / (readings.length - 1)).toFixed(2) : 0;

    container.innerHTML = `
      <div class="consumption-card">
        <h3>Current Reading</h3>
        <p class="value">${lastReading.value.toFixed(2)} m³</p>
      </div>
      <div class="consumption-card">
        <h3>Total Consumption</h3>
        <p class="value">${totalConsumption.toFixed(2)} m³</p>
      </div>
      <div class="consumption-card">
        <h3>Daily Average</h3>
        <p class="value">${avgDaily} m³</p>
      </div>
    `;
  }

  renderReadings(readings) {
    const table = document.getElementById('readingsTable');
    if (!table) return;

    let html = '<table><thead><tr><th>Date</th><th>Reading (m³)</th></tr></thead><tbody>';

    readings.forEach(reading => {
      const date = new Date(reading.reading_date).toLocaleString();
      html += `<tr><td>${date}</td><td>${reading.value.toFixed(2)}</td></tr>`;
    });

    html += '</tbody></table>';
    table.innerHTML = html;
  }

  renderChart(readings) {
    if (readings.length === 0 || !document.getElementById('consumptionChart')) return;

    const ctx = document.getElementById('consumptionChart').getContext('2d');
    const sortedReadings = [...readings].reverse();

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedReadings.map(r => new Date(r.reading_date).toLocaleDateString()),
        datasets: [{
          label: 'Water Consumption (m³)',
          data: sortedReadings.map(r => r.value),
          borderColor: '#005EFF',
          backgroundColor: 'rgba(0, 94, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  setupEventListeners() {
    const selector = document.getElementById('meterSelector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.currentMeterId = parseInt(e.target.value);
        this.loadMeterData(this.currentMeterId);
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
        window.location.href = 'login.html';
      });
    }

    const addReadingBtn = document.getElementById('addReadingBtn');
    if (addReadingBtn) {
      addReadingBtn.addEventListener('click', () => this.showAddReadingModal());
    }
  }

  showAddReadingModal() {
    const modal = document.getElementById('addReadingModal');
    if (!modal) return;
    modal.style.display = 'block';
  }

  async submitReading() {
    const valueInput = document.getElementById('readingValue');
    const value = parseFloat(valueInput.value);

    if (!value || value <= 0) {
      this.showError('Please enter a valid reading value');
      return;
    }

    try {
      await API.addReading(this.currentMeterId, value);
      this.showSuccess('Reading added successfully');
      valueInput.value = '';
      document.getElementById('addReadingModal').style.display = 'none';
      await this.loadMeterData(this.currentMeterId);
    } catch (error) {
      this.showError('Error adding reading: ' + error.message);
    }
  }

  showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  }

  showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  }
}

const dashboard = new Dashboard();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => dashboard.init());
} else {
  dashboard.init();
}
