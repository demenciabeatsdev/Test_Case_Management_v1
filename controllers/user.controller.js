const User = require('../models/user.model');
const Role = require('../models/role.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    try {
        const { username, first_name, last_name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userRole = await Role.findOne({ name: role });
        if (!userRole) return res.status(404).json({ message: 'Role not found' });

        const user = new User({
            username,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: userRole._id
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Controlador de Logout
exports.logout = (req, res) => {
    // Opcionalmente, puedes hacer otras tareas aquí, como revocar tokens si usas una base de datos de sesiones

    res.status(200).json({ message: "Logout successful" });
};
// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('role');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role.name },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// CRUD para Usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Obtener usuario por nombre
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Actualizar usuario por nombre
exports.updateUserByUsername = async (req, res) => {
    try {
        const { first_name, last_name, email, role } = req.body;
        const user = await User.findOne({ username: req.params.username });

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;

        if (role) {
            const userRole = await Role.findOne({ name: role });
            if (userRole) user.role = userRole._id;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Eliminar usuario por nombre
exports.deleteUserByUsername = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ username: req.params.username });
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
