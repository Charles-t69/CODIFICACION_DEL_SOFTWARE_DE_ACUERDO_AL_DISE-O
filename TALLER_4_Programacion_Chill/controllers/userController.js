const db = require('../config/database');

const userController = {
    getStats: (req, res) => {
        const stats = {
            totalUsers: 0,
            totalForms: 0
        };

        // Contar usuarios
        db.query('SELECT COUNT(*) as count FROM users', (err, results) => {
            if (err) {
                console.error('Error counting users:', err);
                return res.status(500).json({ error: 'Error obteniendo estadísticas' });
            }

            stats.totalUsers = results[0].count;

            // Contar formularios totales (suma de todas las tablas)
            const formQueries = [
                'SELECT COUNT(*) as count FROM coding_experiences',
                'SELECT COUNT(*) as count FROM coding_music',
                'SELECT COUNT(*) as count FROM personal_projects',
                'SELECT COUNT(*) as count FROM learning_resources',
                'SELECT COUNT(*) as count FROM community'
            ];

            let completed = 0;
            let total = formQueries.length;

            if (total === 0) {
                return res.json(stats);
            }

            formQueries.forEach((query) => {
                db.query(query, (err, results) => {
                    if (!err && results && results[0]) {
                        stats.totalForms += results[0].count;
                    }
                    
                    completed++;
                    if (completed === total) {
                        res.json(stats);
                    }
                });
            });
        });
    },

    // Obtener todos los usuarios (para admin)
    getAllUsers: (req, res) => {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const query = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
        
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ error: 'Error obteniendo usuarios' });
            }
            res.json(results);
        });
    }
};

module.exports = userController;