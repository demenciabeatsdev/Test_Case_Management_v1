const mongoose = require('mongoose');
const TestCase = require('./testCase.model');

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }, // Null for top-level folders
    created_by: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

// Asegura que el nombre de la carpeta sea único dentro del proyecto y su nivel
folderSchema.index({ name: 1, project: 1, parent: 1 }, { unique: true });

// Método para verificar si una carpeta es de nivel superior
folderSchema.methods.isTopLevel = function() {
    return this.parent === null;
};

// Método para obtener toda la jerarquía de carpetas y casos de prueba en formato árbol
folderSchema.statics.getHierarchy = async function(projectId) {
    const folders = await this.find({ project: projectId }).lean();
    const testCases = await TestCase.find({ project: projectId }).lean();

    // Convert folders array into a tree structure
    const buildTree = (parentId) => {
        return folders
            .filter(folder => String(folder.parent) === String(parentId))
            .map(folder => ({
                ...folder,
                subfolders: buildTree(folder._id),
                test_cases: testCases.filter(tc => String(tc.folder) === String(folder._id))
            }));
    };

    // Only top-level folders (parent === null)
    return buildTree(null);
};

module.exports = mongoose.model('Folder', folderSchema);
