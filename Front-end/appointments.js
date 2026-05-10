console.log("APPOINTMENTS NOVO");

// API base
const API_URL = "http://127.0.0.1:8000";

let currentDate = new Date();
let isSubmitting = false; //

document.addEventListener('DOMContentLoaded', init);

function init() {
    initCalendar();
    setupEventListeners();
    displayAppointments();
}

// =============================
// CALENDAR
// =============================

function initCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        calendarDays.appendChild(createDayElement(day, 'other-month'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.appendChild(createDayElement(day, '', day, year, month));
    }

    const remaining = 42 - calendarDays.children.length;
    for (let day = 1; day <= remaining; day++) {
        calendarDays.appendChild(createDayElement(day, 'other-month'));
    }
}

function createDayElement(day, className, dayDate, year, month) {
    const el = document.createElement('div');
    el.className = `calendar-day ${className}`;
    el.textContent = day;

    if (!className.includes('other-month') && dayDate) {
        el.addEventListener('click', () => selectDate(dayDate, year, month));
    }

    return el;
}

function formatDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function selectDate(day, year, month) {
    document.getElementById('appointmentDate').value =
        formatDateString(year, month, day);
}

// =============================
// API
// =============================

async function getAppointments() {
    const userId = localStorage.getItem("user_id");

    if (!userId) return [];

    try {
        const res = await fetch(`${API_URL}/appointments/${userId}`);
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

async function addAppointment() {
    if (isSubmitting) return;

    isSubmitting = true;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;

    try {
        const userId = parseInt(localStorage.getItem("user_id"));

        if (!userId || isNaN(userId)) {
            alert("Usuário não logado");
            return;
        }

        const appointment = {
            service_type: document.getElementById('appointmentService').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            description: document.getElementById('appointmentDescription').value,
            user_id: userId
        };

        if (!appointment.date || !appointment.time || !appointment.service_type) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }

        const res = await fetch(`${API_URL}/appointments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointment)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail || "Erro ao criar agendamento");
            return;
        }

        document.getElementById('bookingForm').reset();

        alert("Agendamento criado com sucesso!");

        await displayAppointments();

    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com servidor");
    } finally {
        isSubmitting = false;
        btn.disabled = false;
    }
}

async function deleteAppointment(id) {
    const confirmDelete = confirm("Tem certeza que deseja cancelar este agendamento?");

    if (!confirmDelete) return;

    try {
        const res = await fetch(`${API_URL}/appointments/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Erro ao cancelar agendamento");
            return;
        }

        await displayAppointments();

        renderCalendar();

        alert("Agendamento cancelado com sucesso");

    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor");
    }
}

// =============================
// UI
// =============================

function setupEventListeners() {
    const userGreeting = document.getElementById('userGreeting');

    if (userGreeting) {
        userGreeting.addEventListener('click', function(e) {

            const currentUser = localStorage.getItem(USER_STORAGE_KEY);

            if (!currentUser) {
                return;
            }

            e.preventDefault();

            const dropdown = document.getElementById('userDropdown');

            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        });
    }

    document.addEventListener('click', function(e) {

        const userSection = document.querySelector('.user-section');

        if (!userSection.contains(e.target)) {

            const dropdown = document.getElementById('userDropdown');

            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        }
    });
}

function logoutUser() {

    localStorage.removeItem("user_id");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userData");

    alert("Logout realizado");

    window.location.href = "Pag_Login.html";
}

function handleSubmit(e) {
    e.preventDefault();
    addAppointment();
}

async function displayAppointments() {
    const list = document.getElementById('appointmentsList');
    list.innerHTML = '';

    const appointments = await getAppointments();

    if (!appointments.length) {
        list.innerHTML = '<div class="no-appointments">Nenhum agendamento</div>';
        return;
    }

    appointments.forEach(apt => {
        const card = document.createElement('div');
        card.className = 'appointment-card';

        card.innerHTML = `
            <div><strong>${apt.service_type}</strong></div>
            <div>${apt.date} - ${apt.time}</div>
            <div>${apt.description || ""}</div>
            <button onclick="deleteAppointment(${apt.id})">Cancelar</button>
        `;

        list.appendChild(card);
    });
}