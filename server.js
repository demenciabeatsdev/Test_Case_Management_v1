const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const permissionRoutes = require('./routes/permission.routes');
const keywordRoutes = require('./routes/keyword.routes');
const projectRoutes = require('./routes/project.routes'); 
const folderRoutes = require('./routes/folder.routes');
const testCaseRoutes = require('./routes/testCase.routes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/users', userRoutes); // Rutas para usuarios
app.use('/api/roles', roleRoutes); // Rutas para roles
app.use('/api/permissions', permissionRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/testcases', testCaseRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((error) => console.error('Error de conexión:', error));
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
