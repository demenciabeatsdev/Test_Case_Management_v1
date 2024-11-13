const mongoose = require('mongoose');

// Definir el esquema primero
const projectSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    create_by: { type: String, required: true }, // Username
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    keywords: [{ type: String }] // Arreglo de nombres de keywords
});

// Generador de código correlativo
const generateCode = async () => {
    const lastProject = await mongoose.model('Project').findOne().sort({ created_at: -1 });
    const lastCode = lastProject ? parseInt(lastProject.code.split('-')[1]) : 0;
    const newCodeNumber = lastCode + 1;
    return `PY-${newCodeNumber.toString().padStart(4, '0')}`;
};

// Middleware para asignar automáticamente el código correlativo antes de guardar
projectSchema.pre('save', async function (next) {
    if (!this.code) {
        this.code = await generateCode();
    }
    next();
});

// Crear el modelo de Project usando el esquema
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
