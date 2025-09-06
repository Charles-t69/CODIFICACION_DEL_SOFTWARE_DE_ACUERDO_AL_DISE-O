const db = require('../config/database');

const formController = {
    submitCoding: (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const { programming_language, coding_environment, project_type, difficulty_level, description, favorite_moment } = req.body;
        
        const query = `INSERT INTO coding_experiences (user_id, programming_language, coding_environment, project_type, difficulty_level, description, favorite_moment) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(query, [req.session.user.id, programming_language, coding_environment, project_type, difficulty_level, description, favorite_moment], 
            (err, result) => {
                if (err) {
                    console.error('Error inserting coding experience:', err);
                    return res.status(500).json({ error: 'Error guardando datos' });
                }
                res.json({ message: 'Experiencia guardada exitosamente', id: result.insertId });
            }
        );
    },

    submitMusic: (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const { music_genre, favorite_artist, coding_playlist, productivity_level, music_platform, recommendations } = req.body;
        
        const query = `INSERT INTO coding_music (user_id, music_genre, favorite_artist, coding_playlist, productivity_level, music_platform, recommendations) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(query, [req.session.user.id, music_genre, favorite_artist, coding_playlist, productivity_level, music_platform, recommendations], 
            (err, result) => {
                if (err) {
                    console.error('Error inserting music data:', err);
                    return res.status(500).json({ error: 'Error guardando datos' });
                }
                res.json({ message: 'Datos de música guardados', id: result.insertId });
            }
        );
    },

    submitProjects: (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const { project_name, technologies_used, project_status, project_url, challenges_faced, lessons_learned } = req.body;
        
        const query = `INSERT INTO personal_projects (user_id, project_name, technologies_used, project_status, project_url, challenges_faced, lessons_learned) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(query, [req.session.user.id, project_name, technologies_used, project_status, project_url, challenges_faced, lessons_learned], 
            (err, result) => {
                if (err) {
                    console.error('Error inserting project data:', err);
                    return res.status(500).json({ error: 'Error guardando datos' });
                }
                res.json({ message: 'Proyecto guardado', id: result.insertId });
            }
        );
    },

    submitResources: (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const { resource_type, resource_name, resource_url, skill_level, rating, review } = req.body;
        
        const query = `INSERT INTO learning_resources (user_id, resource_type, resource_name, resource_url, skill_level, rating, review) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(query, [req.session.user.id, resource_type, resource_name, resource_url, skill_level, rating, review], 
            (err, result) => {
                if (err) {
                    console.error('Error inserting resource data:', err);
                    return res.status(500).json({ error: 'Error guardando datos' });
                }
                res.json({ message: 'Recurso guardado', id: result.insertId });
            }
        );
    },

    submitCommunity: (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const { collaboration_interest, preferred_techs, availability, communication_style, looking_for_help, can_help_with } = req.body;
        
        const query = `INSERT INTO community (user_id, collaboration_interest, preferred_techs, availability, communication_style, looking_for_help, can_help_with) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(query, [req.session.user.id, collaboration_interest, preferred_techs, availability, communication_style, looking_for_help, can_help_with], 
            (err, result) => {
                if (err) {
                    console.error('Error inserting community data:', err);
                    return res.status(500).json({ error: 'Error guardando datos' });
                }
                res.json({ message: 'Datos de comunidad guardados', id: result.insertId });
            }
        );
    }
};

module.exports = formController;