require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar archivos estáticos
app.use(express.static('public'));
app.use('/views', express.static('views'));

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'programacion-chill-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware de debug (opcional)
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url} - User: ${req.session.user ? req.session.user.username : 'No auth'}`);
    next();
});

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const formRoutes = require('./routes/formRoutes');

// Usar rutas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/forms', formRoutes);

// Middleware para verificar autenticación
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Middleware para verificar admin
const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Acceso denegado. Se requiere rol de administrador.');
    }
    next();
};

// ================= RUTAS PÚBLICAS =================

// Ruta de login
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.user.role === 'admin' ? '/dashboard-admin' : '/dashboard-user');
    }
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Ruta de registro
app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.user.role === 'admin' ? '/dashboard-admin' : '/dashboard-user');
    }
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Ruta principal
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.user.role === 'admin' ? '/dashboard-admin' : '/dashboard-user');
    }
    res.redirect('/login');
});

// ================= RUTAS PROTEGIDAS =================

// Dashboard usuario normal
app.get('/dashboard-user', requireAuth, (req, res) => {
    if (req.session.user.role === 'admin') {
        return res.redirect('/dashboard-admin');
    }
    res.sendFile(path.join(__dirname, 'views', 'dashboard-user.html'));
});

// Dashboard administrador
app.get('/dashboard-admin', requireAuth, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-admin.html'));
});

// ================= FORMULARIOS (PROTEGIDOS) =================

// Formulario 1: Experiencias de Coding
app.get('/forms/coding', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form1-coding.html'));
});

// Formulario 2: Música para Programar
app.get('/forms/music', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form2-music.html'));
});

// Formulario 3: Proyectos Personales
app.get('/forms/projects', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form3-projects.html'));
});

// Formulario 4: Recursos de Aprendizaje
app.get('/forms/resources', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form4-resources.html'));
});

// Formulario 5: Comunidad y Colaboración
app.get('/forms/community', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form5-community.html'));
});

// ================= RESULTADOS (SOLO ADMIN) =================

// Resultados: Coding
app.get('/admin/results/coding', requireAuth, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'results-form1.html'));
});

// Resultados: Música
app.get('/admin/results/music', requireAuth, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'results-form2.html'));
});

// Resultados: Proyectos
app.get('/admin/results/projects', requireAuth, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'results-form3.html'));
});

// Resultados: Recursos
app.get('/admin/results/resources', requireAuth, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'results-form4.html'));
});

// Resultados: Comunidad
app.get('/admin/results/community', requireAuth, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'results-form5.html'));
});

// ================= RUTAS DE DEBUG =================

// Ruta para ver información de sesión (útil para debug)
app.get('/debug-session', (req, res) => {
    res.json({
        sessionExists: !!req.session,
        user: req.session.user,
        sessionID: req.sessionID
    });
});

// Ruta para cerrar sesión (GET alternativa)
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

// ================= MANEJO DE ERRORES =================

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Página no encontrada</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-align: center;
                }
                .error-container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>🔍 404 - Página no encontrada</h1>
                <p>La ruta <strong>${req.url}</strong> no existe.</p>
                <a href="/" style="color: white; text-decoration: underline;">Volver al inicio</a>
            </div>
        </body>
        </html>
    `);
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error del servidor</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-align: center;
                }
                .error-container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>🚨 Error del servidor</h1>
                <p>Ha ocurrido un error inesperado.</p>
                <a href="/" style="color: white; text-decoration: underline;">Volver al inicio</a>
            </div>
        </body>
        </html>
    `);
});

// ================= INICIAR SERVIDOR =================

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
    console.log('📊 Rutas disponibles:');
    console.log('   👉 GET  /login          - Formulario de login');
    console.log('   👉 GET  /register       - Formulario de registro');
    console.log('   👉 GET  /dashboard-user - Dashboard usuario');
    console.log('   👉 GET  /dashboard-admin- Dashboard admin');
    console.log('   👉 GET  /forms/*        - Formularios protegidos');
    console.log('   👉 GET  /admin/results/*- Resultados (solo admin)');
    console.log('   👉 GET  /debug-session  - Debug de sesión');
    console.log('==============================================');
});