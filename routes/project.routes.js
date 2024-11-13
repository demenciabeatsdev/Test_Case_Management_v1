const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

// Rutas CRUD para proyectos
router.post('/', projectController.createProject); // Crear un proyecto
router.get('/', projectController.getAllProjects); // Obtener todos los proyectos
router.get('/:code', projectController.getProjectByCode); // Obtener un proyecto por código
router.put('/:code', projectController.updateProjectByCode); // Actualizar un proyecto por código
router.delete('/:code', projectController.deleteProjectByCode); // Eliminar un proyecto por código

module.exports = router;
