const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    name: { type: String, required: true },
    action: { type: String, required: true },
    expected_result: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

const testCaseSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    summary: { type: String },  // Nuevo campo para resumen
    preconditions: { type: String },  // Nuevo campo para precondiciones
    expected_results: { type: String },  // Nuevo campo para resultados esperados
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    created_by: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    steps: [stepSchema],
});

testCaseSchema.index({ name: 1, folder: 1 }, { unique: true }); // Unique name within the folder

module.exports = mongoose.model('TestCase', testCaseSchema);
