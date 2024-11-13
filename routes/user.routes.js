const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
// Rutas CRUD para usuarios
router.get('/',authMiddleware, userController.getAllUsers); // Obtener todos los usuarios
router.get('/:username',authMiddleware, userController.getUserByUsername); // Obtener usuario por nombre de usuario
router.put('/:username', authMiddleware,userController.updateUserByUsername); // Actualizar usuario por nombre de usuario
router.delete('/:username',authMiddleware, userController.deleteUserByUsername); // Eliminar usuario por nombre de usuario

module.exports = router;
