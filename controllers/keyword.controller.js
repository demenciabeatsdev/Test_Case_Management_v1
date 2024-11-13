const Keyword = require('../models/keyword.model');

// Crear una keyword
exports.createKeyword = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Verificar si la keyword ya existe
        const existingKeyword = await Keyword.findOne({ name });
        if (existingKeyword) return res.status(400).json({ message: 'Keyword name already exists' });

        const keyword = new Keyword({ name, description });
        await keyword.save();
        res.status(201).json(keyword);
    } catch (error) {
        res.status(500).json({ message: 'Error creating keyword', error: error.message });
    }
};

// Obtener todas las keywords
exports.getAllKeywords = async (req, res) => {
    try {
        const keywords = await Keyword.find();
        res.json(keywords);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching keywords', error: error.message });
    }
};

// Obtener una keyword por nombre
exports.getKeywordByName = async (req, res) => {
    try {
        const keyword = await Keyword.findOne({ name: req.params.name });
        if (!keyword) return res.status(404).json({ message: 'Keyword not found' });
        res.json(keyword);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching keyword', error: error.message });
    }
};

// Actualizar una keyword por nombre
exports.updateKeywordByName = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Verificar si la keyword existe
        const keyword = await Keyword.findOne({ name: req.params.name });
        if (!keyword) return res.status(404).json({ message: 'Keyword not found' });

        // Si el nuevo nombre ya existe en otra keyword, bloquear la actualización
        if (name && name !== req.params.name) {
            const existingKeyword = await Keyword.findOne({ name });
            if (existingKeyword) return res.status(400).json({ message: 'Keyword name already exists' });
        }

        // Actualizar la descripción y el nombre si es proporcionado
        keyword.description = description || keyword.description;
        keyword.name = name || keyword.name;

        const updatedKeyword = await keyword.save();
        res.json(updatedKeyword);
    } catch (error) {
        res.status(500).json({ message: 'Error updating keyword', error: error.message });
    }
};

// Eliminar una keyword por nombre
exports.deleteKeywordByName = async (req, res) => {
    try {
        const deletedKeyword = await Keyword.findOneAndDelete({ name: req.params.name });
        if (!deletedKeyword) return res.status(404).json({ message: 'Keyword not found' });

        res.json({ message: 'Keyword deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting keyword', error: error.message });
    }
};
