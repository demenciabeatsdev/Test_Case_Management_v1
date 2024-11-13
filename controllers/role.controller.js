const Role = require('../models/role.model');
const Permission = require('../models/permission.model');

// Crear un rol
exports.createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        // Verificar si el rol ya existe
        const existingRole = await Role.findOne({ name });
        if (existingRole) return res.status(400).json({ message: 'Role name already exists' });

        // Buscar permisos por nombre
        const permissionIds = await Permission.find({ name: { $in: permissions } });
        const role = new Role({ name, permissions: permissionIds });
        
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error: error.message });
    }
};

// Obtener todos los roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roles', error: error.message });
    }
};

// Obtener rol por nombre
exports.getRoleByName = async (req, res) => {
    try {
        const role = await Role.findOne({ name: req.params.name }).populate('permissions');
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching role', error: error.message });
    }
};

// Actualizar rol por nombre
exports.updateRoleByName = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        // Buscar el rol por nombre
        const role = await Role.findOne({ name: req.params.name }).populate('permissions');
        if (!role) return res.status(404).json({ message: 'Role not found' });

        if (permissions) {
            // Obtener los nombres y IDs de los permisos actuales
            const currentPermissionNames = role.permissions.map(permission => permission.name);
            const currentPermissionIds = role.permissions.map(permission => permission._id.toString());

            // Buscar los nuevos permisos por nombre, excluyendo los que ya existen
            const newPermissions = await Permission.find({ name: { $in: permissions } });
            const filteredPermissions = newPermissions.filter(permission => 
                !currentPermissionNames.includes(permission.name) && 
                !currentPermissionIds.includes(permission._id.toString())
            );

            // Agregar los nuevos permisos filtrados al rol sin duplicados
            const newPermissionIds = filteredPermissions.map(permission => permission._id);
            role.permissions = [...currentPermissionIds, ...newPermissionIds];
        }

        // Actualizar solo el nombre si se envía en el body
        role.name = name || role.name;

        // Guardar los cambios
        const updatedRole = await role.save();
        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};

// Eliminar rol por nombre
exports.deleteRoleByName = async (req, res) => {
    try {
        const deletedRole = await Role.findOneAndDelete({ name: req.params.name });
        if (!deletedRole) return res.status(404).json({ message: 'Role not found' });
        
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};
