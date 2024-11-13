const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas CRUD para permisos
router.post('/', authMiddleware, permissionController.createPermission);
router.get('/', authMiddleware, permissionController.getAllPermissions);
router.get('/:name', authMiddleware, permissionController.getPermissionByName); // Cambiado a getPermissionByName
router.put('/:name', authMiddleware, permissionController.updatePermissionByName); // Cambiado a updatePermissionByName
router.delete('/:name', authMiddleware, permissionController.deletePermissionByName); // Cambiado a deletePermissionByName

module.exports = router;
