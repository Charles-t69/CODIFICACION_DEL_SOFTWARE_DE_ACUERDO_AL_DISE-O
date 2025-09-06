// Manejo de formularios de login/register
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Cargar estadísticas del dashboard admin
    if (window.location.pathname.includes('dashboard-admin')) {
        loadAdminStats();
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            window.location.href = result.redirect;
        } else {
            alert(result.error || 'Error en el login');
        }
    } catch (error) {
        alert('Error de conexión');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Cuenta creada exitosamente');
            window.location.href = '/views/login.html';
        } else {
            alert(result.error || 'Error en el registro');
        }
    } catch (error) {
        alert('Error de conexión');
    }
}

async function logout() {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST'
        });
        window.location.href = '/';
    } catch (error) {
        window.location.href = '/';
    }
}

async function loadAdminStats() {
    try {
        const response = await fetch('/user/stats');
        const stats = await response.json();
        
        document.getElementById('totalUsers').textContent = stats.totalUsers || '0';
        document.getElementById('totalForms').textContent = stats.totalForms || '0';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Manejo de formularios específicos
async function submitForm(formId, formData) {
    try {
        const response = await fetch(`/forms/${formId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Formulario enviado exitosamente!');
            window.location.href = '/dashboard-user';
        } else {
            alert(result.error || 'Error al enviar el formulario');
        }
    } catch (error) {
        alert('Error de conexión');
    }
}