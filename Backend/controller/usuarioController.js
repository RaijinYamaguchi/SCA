const usuario = require('../models/usuarioModel');

const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await usuario.getAllUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error('Error fetching usuarios:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuarioData = await usuario.getUsuarioById(id);
        if (usuarioData) {
            res.json(usuarioData);
        } else {
            res.status(404).json({ error: 'Usuario not found' });
        }
    } catch (error) {
        console.error(`Error fetching usuario with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};     

const createUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const newUsuario = await usuario.createUsuario(nome, email, senha);
        res.status(201).json(newUsuario);
    } catch (error) {
        console.error('Error creating usuario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateUsuario = async (req, res) => {
    const id = req.params.id;
    const { nome, email, senha } = req.body;
    try {
        const updatedUsuario = await usuario.updateUsuario(id, nome, email, senha);
        if (updatedUsuario) {
            res.json(updatedUsuario);
        } else {
            res.status(404).json({ error: 'Usuario not found' });
        }
    } catch (error) {
        console.error(`Error updating usuario with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await usuario.deleteUsuario(id);
        if (deleted) {
            res.json({ message: 'Usuario deleted successfully' });
        } else {
            res.status(404).json({ error: 'Usuario not found' });
        }
    } catch (error) {
        console.error(`Error deleting usuario with id ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {getAllUsuarios,getUsuarioById,createUsuario,updateUsuario,deleteUsuario};