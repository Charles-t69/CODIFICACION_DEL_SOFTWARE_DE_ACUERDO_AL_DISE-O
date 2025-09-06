-- Crear base de datos
CREATE DATABASE IF NOT EXISTS programacion_chill_db;
USE programacion_chill_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de formulario 1: Experiencias de Coding
CREATE TABLE IF NOT EXISTS coding_experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    programming_language VARCHAR(100),
    coding_environment VARCHAR(100),
    project_type VARCHAR(100),
    difficulty_level ENUM('fácil', 'medio', 'difícil'),
    description TEXT,
    favorite_moment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de formulario 2: Música para Programar
CREATE TABLE IF NOT EXISTS coding_music (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    music_genre VARCHAR(100),
    favorite_artist VARCHAR(100),
    coding_playlist VARCHAR(255),
    productivity_level ENUM('bajo', 'medio', 'alto'),
    music_platform VARCHAR(100),
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de formulario 3: Proyectos Personales
CREATE TABLE IF NOT EXISTS personal_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    project_name VARCHAR(255),
    technologies_used TEXT,
    project_status ENUM('idea', 'desarrollo', 'completado', 'abandonado'),
    project_url VARCHAR(255),
    challenges_faced TEXT,
    lessons_learned TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de formulario 4: Recursos de Aprendizaje
CREATE TABLE IF NOT EXISTS learning_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    resource_type ENUM('curso', 'libro', 'tutorial', 'podcast', 'blog'),
    resource_name VARCHAR(255),
    resource_url VARCHAR(255),
    skill_level ENUM('principiante', 'intermedio', 'avanzado'),
    rating INT,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de formulario 5: Comunidad y Colaboración
CREATE TABLE IF NOT EXISTS community (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    collaboration_interest BOOLEAN,
    preferred_techs TEXT,
    availability ENUM('poco', 'moderado', 'mucho'),
    communication_style ENUM('directo', 'colaborativo', 'técnico'),
    looking_for_help BOOLEAN,
    can_help_with TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertar usuario admin por defecto (contraseña: admin)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@programacionchill.com', 'admin', 'admin');

-- Insertar usuario normal de prueba (contraseña: user)
INSERT INTO users (username, email, password) VALUES 
('user', 'user@example.com', 'user');