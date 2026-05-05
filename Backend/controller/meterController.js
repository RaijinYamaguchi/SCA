const meterModel = require('../models/meterModel');
const readingModel = require('../models/readingModel');

const getMeters = async (req, res) => {
  try {
    const userId = req.userId;
    const meters = await meterModel.getUserMeters(userId);

    for (let meter of meters) {
      const lastReading = await readingModel.getLastReading(meter.id);
      meter.lastReading = lastReading?.value || 0;
      meter.lastReadingDate = lastReading?.reading_date || null;
    }

    res.json(meters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMeterById = async (req, res) => {
  try {
    const { id } = req.params;
    const meter = await meterModel.getMeterById(id);

    if (!meter) {
      return res.status(404).json({ error: 'Meter not found' });
    }

    if (meter.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(meter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMeter = async (req, res) => {
  try {
    const { name, location } = req.body;
    const userId = req.userId;

    if (!name) {
      return res.status(400).json({ error: 'Meter name required' });
    }

    const meterId = await meterModel.createMeter(userId, name, location || '');
    res.status(201).json({ id: meterId, name, location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMeter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const meter = await meterModel.getMeterById(id);
    if (!meter || meter.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await meterModel.updateMeter(id, name, location);
    res.json({ message: 'Meter updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMeter = async (req, res) => {
  try {
    const { id } = req.params;

    const meter = await meterModel.getMeterById(id);
    if (!meter || meter.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await meterModel.deleteMeter(id);
    res.json({ message: 'Meter deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReadings = async (req, res) => {
  try {
    const { id } = req.params;
    const meter = await meterModel.getMeterById(id);

    if (!meter || meter.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const readings = await readingModel.getMeterReadings(id);
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addReading = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, readingDate } = req.body;

    if (!value) {
      return res.status(400).json({ error: 'Reading value required' });
    }

    const meter = await meterModel.getMeterById(id);
    if (!meter || meter.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const readingId = await readingModel.createReading(id, value, readingDate);
    res.status(201).json({ id: readingId, value, readingDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMeters,
  getMeterById,
  createMeter,
  updateMeter,
  deleteMeter,
  getReadings,
  addReading
};
