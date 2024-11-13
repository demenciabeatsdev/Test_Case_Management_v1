const Project = require('../models/project.model');
const Keyword = require('../models/keyword.model'); // Importar el modelo de Keyword


// Crear un proyecto
exports.createProject = async (req, res) => {
    try {
        const { name, description, create_by, keywords } = req.body;

        // Verificar si ya existe un proyecto con el mismo nombre
        const existingProject = await Project.findOne({ name });
        if (existingProject) return res.status(400).json({ message: 'Project name already exists' });

        // Validar la existencia de las keywords proporcionadas
        const existingKeywords = await Keyword.find({ name: { $in: keywords } });
        if (existingKeywords.length !== keywords.length) {
            return res.status(400).json({ message: 'Some keywords do not exist' });
        }

        // Eliminar duplicados en keywords
        const uniqueKeywords = [...new Set(keywords)];

        const project = new Project({ name, description, create_by, keywords: uniqueKeywords });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};
// Obtener todos los proyectos
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// Obtener un proyecto por código
exports.getProjectByCode = async (req, res) => {
    try {
        const project = await Project.findOne({ code: req.params.code });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

// Actualizar un proyecto por código
exports.updateProjectByCode = async (req, res) => {
    try {
        const { name, description, active, keywords } = req.body;

        const project = await Project.findOne({ code: req.params.code });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Si se proporciona un nuevo nombre, verificar duplicados
        if (name && name !== project.name) {
            const existingProject = await Project.findOne({ name });
            if (existingProject) return res.status(400).json({ message: 'Project name already exists' });
        }

        // Validar la existencia de las keywords proporcionadas
        if (keywords) {
            const existingKeywords = await Keyword.find({ name: { $in: keywords } });
            if (existingKeywords.length !== keywords.length) {
                return res.status(400).json({ message: 'Some keywords do not exist' });
            }

            // Eliminar duplicados en keywords y combinar con las actuales
            const uniqueKeywords = [...new Set([...project.keywords, ...keywords])];
            project.keywords = uniqueKeywords;
        }

        // Actualizar los campos proporcionados
        project.name = name || project.name;
        project.description = description || project.description;
        project.active = active !== undefined ? active : project.active;
        project.updated_at = Date.now();

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

// Eliminar un proyecto por código
exports.deleteProjectByCode = async (req, res) => {
    try {
        const deletedProject = await Project.findOneAndDelete({ code: req.params.code });
        if (!deletedProject) return res.status(404).json({ message: 'Project not found' });

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};
