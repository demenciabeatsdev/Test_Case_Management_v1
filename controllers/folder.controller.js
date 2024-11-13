const Folder = require('../models/folder.model');
const TestCase = require('../models/testCase.model');
const Project = require('../models/project.model');

exports.createFolder = async (req, res) => {
    try {
        const { name, description, parent_folder, created_by, projectCode } = req.body;

        // Buscar el ObjectId del proyecto usando el código
        const project = await Project.findOne({ code: projectCode });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Crear la carpeta con el ObjectId del proyecto
        const folder = new Folder({
            name,
            description,
            parent_folder,
            created_by,
            project: project._id  // Usando el ObjectId en lugar del código
        });

        await folder.save();
        res.status(201).json(folder);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating folder', error: error.message });
    }
};

// Obtener todas las carpetas en jerarquía para un proyecto
exports.getFolderHierarchy = async (req, res) => {
    try {
        const hierarchy = await Folder.getHierarchy(req.params.projectId);
        res.json(hierarchy);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folder hierarchy', error: error.message });
    }
};

// Actualizar una carpeta
exports.updateFolder = async (req, res) => {
    try {
        const { name, parent, updated_by } = req.body;
        const folder = await Folder.findOne({ _id: req.params.id });

        if (!folder) return res.status(404).json({ message: 'Folder not found' });

        // Verificar si ya existe una carpeta con el mismo nombre en el mismo nivel y proyecto
        if (name && name !== folder.name) {
            const existingFolder = await Folder.findOne({ name, project: folder.project, parent });
            if (existingFolder) return res.status(400).json({ message: 'Folder name already exists in this level' });
        }

        // Validar que solo carpetas de nivel superior puedan contener casos de prueba
        if (parent && !folder.isTopLevel()) {
            return res.status(400).json({ message: 'Only top-level folders can contain test cases' });
        }

        folder.name = name || folder.name;
        folder.parent = parent !== undefined ? parent : folder.parent;
        folder.updated_at = Date.now();

        const updatedFolder = await folder.save();
        res.json(updatedFolder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating folder', error: error.message });
    }
};

// Eliminar una carpeta
exports.deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if (!folder) return res.status(404).json({ message: 'Folder not found' });

        await Folder.deleteOne({ _id: req.params.id });
        res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting folder', error: error.message });
    }
};
