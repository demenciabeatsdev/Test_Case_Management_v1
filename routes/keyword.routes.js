const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keyword.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas CRUD para keywords
router.post('/',authMiddleware, keywordController.createKeyword); // Crear una keyword
router.get('/',authMiddleware, keywordController.getAllKeywords); // Obtener todas las keywords
router.get('/:name',authMiddleware, keywordController.getKeywordByName); // Obtener una keyword por nombre
router.put('/:name',authMiddleware, keywordController.updateKeywordByName); // Actualizar una keyword por nombre
router.delete('/:name',authMiddleware, keywordController.deleteKeywordByName); // Eliminar una keyword por nombre

module.exports = router;
