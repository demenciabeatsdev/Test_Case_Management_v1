const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const authMiddleware = require('../middleware/auth.middleware');
// Rutas CRUD para roles
router.post('/',authMiddleware, roleController.createRole); // Crear un nuevo rol
router.get('/',authMiddleware, roleController.getAllRoles); // Obtener todos los roles
router.get('/:name',authMiddleware, roleController.getRoleByName); // Obtener rol por nombre
router.put('/:name', authMiddleware,roleController.updateRoleByName); // Actualizar rol por nombre
router.delete('/:name', authMiddleware,roleController.deleteRoleByName); // Eliminar rol por nombre

module.exports = router;
