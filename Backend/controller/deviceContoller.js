const device = require('../models/deviceModel');

const getAllDevices = async (req, res) => {
    try {
        const devices = await device.getAllDevices();
        res.json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getDeviceById = async (req, res) => {
    const id = req.params.id;
    try {
        const deviceData = await device.getDeviceById(id);
        if (deviceData) {
            res.json(deviceData);
        } else {
            res.status(404).json({ error: 'Device not found' });
        }
    } catch (error) {
        console.error(`Error fetching device with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createDevice = async (req, res) => {
    const { nome, tipo, status } = req.body;
    try {
        const newDevice = await device.createDevice(nome, tipo, status);
        res.status(201).json(newDevice);
    } catch (error) {
        console.error('Error creating device:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateDevice = async (req, res) => {
    const id = req.params.id;
    const { nome, tipo, status } = req.body;
    try {
        const updatedDevice = await device.updateDevice(id, nome, tipo, status);
        if (updatedDevice) {
            res.json(updatedDevice);
        } else {
            res.status(404).json({ error: 'Device not found' });
        }
    } catch (error) {
        console.error(`Error updating device with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteDevice = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await device.deleteDevice(id);
        if (deleted) {
            res.json({ message: 'Device deleted successfully' });
        } else {
            res.status(404).json({ error: 'Device not found' });
        }
    } catch (error) {
        console.error(`Error deleting device with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllDevices,
    getDeviceById,
    createDevice,
    updateDevice,
    deleteDevice
}; 