const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folder.controller');
const authMiddleware = require('../middleware/auth.middleware');

// CRUD de carpetas y jerarquía
router.post('/',authMiddleware, folderController.createFolder); // Crear carpeta
router.get('/:projectId/hierarchy', authMiddleware,folderController.getFolderHierarchy); // Obtener jerarquía completa
router.put('/:id', authMiddleware,folderController.updateFolder); // Actualizar carpeta
router.delete('/:id',authMiddleware, folderController.deleteFolder); // Eliminar carpeta

module.exports = router;
