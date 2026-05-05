const registroModel = require('../models/registro');

const getAllRegistros = async (req, res) => {
    try {
        const registros = await registroModel.getAllRegistros();
        res.json(registros);
    } catch (error) {
        console.error('Error fetching registros:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getRegistroById = async (req, res) => {
    const id = req.params.id;
    try {
        const registroData = await registroModel.getRegistroById(id);
        if (registroData) {
            res.json(registroData);
        } else {
            res.status(404).json({ error: 'Registro not found' });
        }
    } catch (error) {
        console.error(`Error fetching registro with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createRegistro = async (req, res) => {
    const { usuario_id, device_id, acao } = req.body;
    try {
        const newRegistro = await registroModel.createRegistro(usuario_id, device_id, acao);
        res.status(201).json(newRegistro);
    } catch (error) {
        console.error('Error creating registro:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteRegistro = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await registroModel.deleteRegistro(id);
        if (deleted) {
            res.json({ message: 'Registro deleted successfully' });
        } else {
            res.status(404).json({ error: 'Registro not found' });
        }
    } catch (error) {
        console.error(`Error deleting registro with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllRegistros,
    getRegistroById,
    createRegistro,
    deleteRegistro
};         