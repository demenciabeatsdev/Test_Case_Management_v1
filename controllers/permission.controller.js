const Permission = require('../models/permission.model');

// Crear un permiso
exports.createPermission = async (req, res) => {
    try {
        const { name } = req.body;

        // Verificar si el permiso ya existe
        const existingPermission = await Permission.findOne({ name });
        if (existingPermission) return res.status(400).json({ message: 'Permission name already exists' });

        const permission = new Permission({ name });
        await permission.save();
        res.status(201).json(permission);
    } catch (error) {
        res.status(500).json({ message: 'Error creating permission', error: error.message });
    }
};

// Obtener todos los permisos
exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permissions', error: error.message });
    }
};

// Obtener permiso por nombre
exports.getPermissionByName = async (req, res) => {
    try {
        const permission = await Permission.findOne({ name: req.params.name });
        if (!permission) return res.status(404).json({ message: 'Permission not found' });
        res.json(permission);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permission', error: error.message });
    }
};

// Actualizar permiso por nombre
exports.updatePermissionByName = async (req, res) => {
    try {
        const { name } = req.body;
        const permission = await Permission.findOne({ name: req.params.name });

        if (!permission) return res.status(404).json({ message: 'Permission not found' });

        permission.name = name || permission.name;
        const updatedPermission = await permission.save();

        res.json(updatedPermission);
    } catch (error) {
        res.status(500).json({ message: 'Error updating permission', error: error.message });
    }
};

// Eliminar permiso por nombre
exports.deletePermissionByName = async (req, res) => {
    try {
        const deletedPermission = await Permission.findOneAndDelete({ name: req.params.name });
        if (!deletedPermission) return res.status(404).json({ message: 'Permission not found' });
        
        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting permission', error: error.message });
    }
};
