const TestCase = require('../models/testCase.model');
const Project = require('../models/project.model');
const Folder = require('../models/folder.model');

// Generar un código correlativo para los casos de prueba
const generateTestCaseCode = async () => {
    const count = await TestCase.countDocuments();
    const code = `TC-${String(count + 1).padStart(4, '0')}`;
    return code;
};

// Crear un nuevo caso de prueba
exports.createTestCase = async (req, res) => {
    try {
        const { name, description, summary, preconditions, expected_results, project, folder, created_by, steps } = req.body;

        // Validar existencia de proyecto y carpeta
        const existingProject = await Project.findById(project);
        if (!existingProject) return res.status(404).json({ message: 'Project not found' });

        const existingFolder = await Folder.findById(folder);
        if (!existingFolder) return res.status(404).json({ message: 'Folder not found' });

        // Verificar que el nombre sea único dentro de la carpeta
        const existingTestCase = await TestCase.findOne({ name, folder });
        if (existingTestCase) return res.status(400).json({ message: 'Test case name already exists in this folder' });

        // Generar código correlativo
        const code = await generateTestCaseCode();

        // Crear el caso de prueba
        const testCase = new TestCase({
            code,
            name,
            description,
            summary,
            preconditions,
            expected_results,
            project,
            folder,
            created_by,
            steps,
        });

        await testCase.save();
        res.status(201).json(testCase);
    } catch (error) {
        res.status(500).json({ message: 'Error creating test case', error: error.message });
    }
};

// Obtener todos los casos de prueba en un proyecto
exports.getAllTestCases = async (req, res) => {
    try {
        const testCases = await TestCase.find({ project: req.params.projectId }).populate('folder');
        res.json(testCases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching test cases', error: error.message });
    }
};

// Obtener un caso de prueba por código
exports.getTestCaseByCode = async (req, res) => {
    try {
        const testCase = await TestCase.findOne({ code: req.params.code }).populate('folder');
        if (!testCase) return res.status(404).json({ message: 'Test case not found' });
        res.json(testCase);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching test case', error: error.message });
    }
};

// Actualizar un caso de prueba por código
exports.updateTestCaseByCode = async (req, res) => {
    try {
        const { name, description, summary, preconditions, expected_results, steps } = req.body;
        const testCase = await TestCase.findOne({ code: req.params.code });

        if (!testCase) return res.status(404).json({ message: 'Test case not found' });

        // Verificar que el nombre sea único dentro de la carpeta
        if (name && name !== testCase.name) {
            const existingTestCase = await TestCase.findOne({ name, folder: testCase.folder });
            if (existingTestCase) return res.status(400).json({ message: 'Test case name already exists in this folder' });
        }

        // Actualizar campos
        testCase.name = name || testCase.name;
        testCase.description = description || testCase.description;
        testCase.summary = summary || testCase.summary;
        testCase.preconditions = preconditions || testCase.preconditions;
        testCase.expected_results = expected_results || testCase.expected_results;
        testCase.steps = steps || testCase.steps;
        testCase.updated_at = Date.now();

        const updatedTestCase = await testCase.save();
        res.json(updatedTestCase);
    } catch (error) {
        res.status(500).json({ message: 'Error updating test case', error: error.message });
    }
};

// Eliminar un caso de prueba por código
exports.deleteTestCaseByCode = async (req, res) => {
    try {
        const deletedTestCase = await TestCase.findOneAndDelete({ code: req.params.code });
        if (!deletedTestCase) return res.status(404).json({ message: 'Test case not found' });

        res.json({ message: 'Test case deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting test case', error: error.message });
    }
};
