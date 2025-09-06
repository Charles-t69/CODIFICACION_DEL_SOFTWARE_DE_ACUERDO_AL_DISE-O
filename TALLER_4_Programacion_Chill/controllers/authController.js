const db = require('../config/database');

const authController = {
    login: (req, res) => {
        const { username, password } = req.body;
        
        // Buscar usuario por username o email
        const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(query, [username, username], (err, results) => {
            if (err) {
                console.error('Error en login:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const user = results[0];
            
            // Verificar contraseña (simplificado para demo)
            if (password !== user.password) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Guardar en sesión
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            };

            res.json({
                message: 'Login exitoso',
                redirect: user.role === 'admin' ? '/dashboard-admin' : '/dashboard-user'
            });
        });
    },

    register: (req, res) => {
        const { username, email, password } = req.body;
        
        // Verificar si el usuario ya existe
        const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkQuery, [username, email], (err, results) => {
            if (err) {
                console.error('Error en registro:', err);
                return res.status(500).json({ error: 'Error del servidor' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Usuario o email ya existe' });
            }

            // Crear nuevo usuario
            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, email, password], (err, result) => {
                if (err) {
                    console.error('Error creando usuario:', err);
                    return res.status(500).json({ error: 'Error creando usuario' });
                }

                res.json({ message: 'Usuario creado exitosamente' });
            });
        });
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al cerrar sesión' });
            }
            res.json({ message: 'Sesión cerrada' });
        });
    }
};

module.exports = authController;