console.log("LOGIN JS CARREGOU");

// Local storage keys
const USER_STORAGE_KEY = 'currentUser';
const USER_DATA_KEY = 'userData';

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

async function authenticateUser(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail || "Email ou senha inválidos");
            return;
        }

        localStorage.setItem("user_id", data.user.id);

        localStorage.setItem("currentUser", email);

        localStorage.setItem("userData", JSON.stringify({
            name: data.user.name,
            email: data.user.email
        }));

        alert("Login realizado com sucesso!");

        window.location.href = "Pag_Inicial.html";

    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor");
    }
}


async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    if (!name || !email || !password) {
        alert("Preencha todos os campos");
        return;
    }

    if (password !== passwordConfirm) {
        alert("Senhas não coincidem");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await res.json();

        console.log("STATUS:", res.status);
        console.log("DATA:", data);

        if (res.ok) {
            alert("Usuário registrado com sucesso!");
            switchTab('login');
        } else {
            alert(data.detail || "Usuário já existe");
        }

    } catch (err) {
        console.error("ERRO:", err);
        alert("Erro ao conectar com servidor");
    }
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
