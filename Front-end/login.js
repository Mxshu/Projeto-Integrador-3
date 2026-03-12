// Local storage keys
const USER_STORAGE_KEY = 'currentUser';
const USER_DATA_KEY = 'userData';

// User database (simulating backend - in real implementation, this would be on the server)
const USER_DATABASE = {
    'user@example.com': {
        email: 'user@example.com',
        password: '123456',
        name: 'João Silva'
    },
    'admin@example.com': {
        email: 'admin@example.com',
        password: 'admin',
        name: 'Maria Santos'
    },
    'client@example.com': {
        email: 'client@example.com',
        password: 'password',
        name: 'Carlos Oliveira'
    }
};

// Initialize login on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    setupEventListeners();
});

function initializeLogin() {
    const currentUser = localStorage.getItem(USER_STORAGE_KEY);
    const userGreeting = document.getElementById('userGreeting');
    
    if (currentUser) {
        const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
        if (userGreeting) {
            userGreeting.textContent = `Olá, ${userData.name}!`;
            userGreeting.href = '#';
            userGreeting.style.cursor = 'pointer';
            userGreeting.classList.add('logged-in');
        }
    } else {
        if (userGreeting) {
            userGreeting.textContent = 'Olá, visitante!';
            userGreeting.href = 'Pag_Login.html';
            userGreeting.style.cursor = 'pointer';
            userGreeting.classList.remove('logged-in');
        }
    }
}

function authenticateUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validate credentials against the database (simulating backend check)
    const user = USER_DATABASE[email];
    
    if (!user || user.password !== password) {
        alert('Email ou senha inválidos. Tente novamente.\n\nDica: Use user@example.com / 123456');
        return;
    }
    
    // Store user data in local storage (simulating backend response)
    const userData = {
        email: user.email,
        name: user.name
    };
    
    localStorage.setItem(USER_STORAGE_KEY, email);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    alert(`Bem-vindo, ${userData.name}!`);
    // Redirect to appointments page or previous page
    window.location.href = 'Pag_Agendamento.html';
}

function registerUser(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    // Validation
    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    if (password !== passwordConfirm) {
        alert('As senhas não coincidem!');
        return;
    }
    
    if (password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres!');
        return;
    }
    
    // Check if email already exists (simulating backend validation)
    if (USER_DATABASE[email]) {
        alert('Este email já está registrado. Tente fazer login ou use outro email.');
        return;
    }
    
    // Register new user
    USER_DATABASE[email] = {
        email: email,
        password: password,
        name: name
    };
    
    // Auto-login after registration
    const userData = {
        email: email,
        name: name
    };
    
    localStorage.setItem(USER_STORAGE_KEY, email);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    alert(`Conta criada com sucesso! Bem-vindo, ${name}!`);
    window.location.href = 'Pag_Agendamento.html';
}

function logoutUser() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        closeUserDropdown();
        alert('Você saiu com sucesso!');
        window.location.href = 'Pag_Inicial.html';
    }
}

function editUserInfo() {
    const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
    const newName = prompt('Digite seu novo nome:', userData.name);
    
    if (newName && newName.trim()) {
        userData.name = newName.trim();
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        
        // Update UI
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) {
            userGreeting.textContent = `Olá, ${userData.name}!`;
        }
        
        closeUserDropdown();
        alert('Informações atualizadas com sucesso!');
    }
}

function toggleUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    const currentUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (currentUser && userDropdown) {
        userDropdown.classList.toggle('hidden');
    }
}

function closeUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.add('hidden');
    }
}

function setupEventListeners() {
    const userGreeting = document.getElementById('userGreeting');
    const currentUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (userGreeting && currentUser) {
        userGreeting.addEventListener('click', function(e) {
            e.preventDefault();
            toggleUserDropdown();
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const userSection = document.querySelector('.user-section');
        if (userSection && !userSection.contains(e.target)) {
            closeUserDropdown();
        }
    });
}
