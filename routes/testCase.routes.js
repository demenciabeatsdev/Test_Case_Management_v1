const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCase.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas para casos de prueba
router.post('/',authMiddleware, testCaseController.createTestCase); // Crear un caso de prueba
router.get('/:projectId',authMiddleware, testCaseController.getAllTestCases); // Obtener todos los casos de prueba de un proyecto
router.get('/code/:code',authMiddleware, testCaseController.getTestCaseByCode); // Obtener un caso de prueba por código
router.put('/code/:code',authMiddleware, testCaseController.updateTestCaseByCode); // Actualizar un caso de prueba por código
router.delete('/code/:code',authMiddleware, testCaseController.deleteTestCaseByCode); // Eliminar un caso de prueba por código

module.exports = router;
