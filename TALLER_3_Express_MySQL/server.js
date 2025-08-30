const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Configuración de MySQL (AJUSTA CON TUS CREDENCIALES)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // ← Tu usuario de MySQL
    password: '',        // ← Tu contraseña de MySQL
    database: 'taller3_db' // ← La base que creamos
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL Database');
});

// Ruta principal - Formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para procesar formulario CON BASE DE DATOS REAL
app.post('/envia', (req, res) => {
    const { nombre, email, mensaje } = req.body;
    
    // Validar datos
    if (!nombre || !email || !mensaje) {
        return res.send('❌ Todos los campos son obligatorios');
    }

    // Insertar en MySQL
    const sql = 'INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)';
    
    db.query(sql, [nombre, email, mensaje], (err, result) => {
        if (err) {
            console.error('❌ Error insertando en MySQL:', err);
            return res.send('Error al guardar en la base de datos');
        }

        console.log('✅ Registro insertado. ID:', result.insertId);
        
        // Respuesta de éxito con Bootstrap
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mensaje Enviado</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
                <style>
                    body {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    .success-card {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        animation: fadeInUp 0.6s ease;
                    }
                    .success-icon {
                        font-size: 4rem;
                        color: #28a745;
                        animation: bounce 1s;
                    }
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-8 col-lg-6">
                            <div class="success-card text-center">
                                <div class="success-icon mb-4">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <h2 class="text-success mb-3">¡Excelente, ${nombre}!</h2>
                                <p class="lead">Tu mensaje ha sido guardado en nuestra base de datos</p>
                                
                                <div class="card mb-4">
                                    <div class="card-body text-start">
                                        <h5 class="card-title">📋 Detalles del mensaje:</h5>
                                        <p><strong>📧 Email:</strong> ${email}</p>
                                        <p><strong>💬 Mensaje:</strong> ${mensaje}</p>
                                        <p><strong>🆔 ID de registro:</strong> #${result.insertId}</p>
                                    </div>
                                </div>

                                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                                    <a href="/" class="btn btn-primary me-md-2">
                                        <i class="fas fa-arrow-left me-2"></i>Enviar otro mensaje
                                    </a>
                                    <a href="/ver-mensajes" class="btn btn-outline-primary">
                                        <i class="fas fa-list me-2"></i>Ver todos los mensajes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    });
});

// Ruta para ver todos los mensajes
app.get('/ver-mensajes', (req, res) => {
    const sql = 'SELECT * FROM mensajes ORDER BY fecha DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error leyendo mensajes:', err);
            return res.send('Error al leer la base de datos');
        }

        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Todos los Mensajes</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    body {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                    }
                    .header {
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 15px;
                        padding: 30px;
                        margin-bottom: 20px;
                        backdrop-filter: blur(10px);
                    }
                    .table-container {
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 15px;
                        padding: 20px;
                        backdrop-filter: blur(10px);
                    }
                    table {
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    tr:hover {
                        background-color: rgba(102, 126, 234, 0.1) !important;
                        transition: background-color 0.3s ease;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header text-center">
                        <h1><i class="fas fa-database me-2"></i>Base de Datos MySQL</h1>
                        <p class="lead">Todos los mensajes almacenados</p>
                        <span class="badge bg-primary">Total: ${results.length} mensajes</span>
                    </div>

                    <div class="table-container">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th><i class="fas fa-hashtag"></i> ID</th>
                                        <th><i class="fas fa-user"></i> Nombre</th>
                                        <th><i class="fas fa-envelope"></i> Email</th>
                                        <th><i class="fas fa-comment"></i> Mensaje</th>
                                        <th><i class="fas fa-calendar"></i> Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
        `;

        results.forEach(row => {
            html += `
                <tr>
                    <td><strong>#${row.id}</strong></td>
                    <td>${row.nombre}</td>
                    <td>${row.email}</td>
                    <td>${row.mensaje}</td>
                    <td>${new Date(row.fecha).toLocaleString('es-ES')}</td>
                </tr>
            `;
        });

        html += `
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="text-center mt-4">
                            <a href="/" class="btn btn-primary">
                                <i class="fas fa-arrow-left me-2"></i>Volver al formulario
                            </a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        res.send(html);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor con MySQL REAL ejecutándose en: http://localhost:${PORT}`);
});