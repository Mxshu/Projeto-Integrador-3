// Local storage key for appointments
const STORAGE_KEY = 'appointments';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    setupEventListeners();
    displayAppointments();
});

// Calendar functionality
let currentDate = new Date();

function initCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month/year display
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Clear calendar
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Add previous month's days (grayed out)
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createDayElement(day, 'other-month', null, year, month - 1);
        calendarDays.appendChild(dayElement);
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && 
                       month === today.getMonth() && 
                       year === today.getFullYear();
        
        const dayElement = createDayElement(day, isToday ? 'today' : '', day, year, month);
        calendarDays.appendChild(dayElement);
    }
    
    // Add next month's days (grayed out)
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, 'other-month', null, year, month + 1);
        calendarDays.appendChild(dayElement);
    }
}

function createDayElement(day, className, dayDate, year, month) {
    const element = document.createElement('div');
    element.className = `calendar-day ${className}`;
    element.textContent = day;
    
    // Check if this day has appointments
    if (dayDate) {
        const dateStr = formatDateString(year, month, dayDate);
        const appointments = getAppointments();
        const hasAppointment = appointments.some(apt => apt.date === dateStr);
        if (hasAppointment) {
            element.classList.add('has-appointment');
        }
    }
    
    // Add click event for current month only
    if (!className.includes('other-month') && dayDate) {
        element.addEventListener('click', function() {
            selectDate(dayDate, year, month);
        });
    }
    
    return element;
}

function formatDateString(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

function selectDate(day, year, month) {
    const dateStr = formatDateString(year, month, day);
    document.getElementById('appointmentDate').value = dateStr;
    
    // Update visual selection
    document.querySelectorAll('.calendar-day').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addAppointment();
    });
}

// Appointments management
function getAppointments() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveAppointments(appointments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function addAppointment() {
    const form = document.getElementById('bookingForm');
    const appointment = {
        id: Date.now(),
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        service: document.getElementById('appointmentService').value,
        description: document.getElementById('appointmentDescription').value
    };
    
    // Validation
    if (!appointment.date || !appointment.time || !appointment.service) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    // Check for conflicting appointments
    const appointments = getAppointments();
    const hasConflict = appointments.some(apt => 
        apt.date === appointment.date && apt.time === appointment.time
    );
    
    if (hasConflict) {
        alert('Desculpe, já existe um agendamento neste horário. Por favor, escolha outro horário.');
        return;
    }
    
    // Add appointment
    appointments.push(appointment);
    saveAppointments(appointments);
    
    // Reset form and update UI
    form.reset();
    displayAppointments();
    renderCalendar();
    alert('Agendamento realizado com sucesso!');
}

function deleteAppointment(id) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        let appointments = getAppointments();
        appointments = appointments.filter(apt => apt.id !== id);
        saveAppointments(appointments);
        displayAppointments();
        renderCalendar();
    }
}

function displayAppointments() {
    const appointments = getAppointments();
    const appointmentsList = document.getElementById('appointmentsList');
    
    // Sort appointments by date and time
    appointments.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });
    
    // Filter to show only future appointments
    const now = new Date();
    const futureAppointments = appointments.filter(apt => {
        const aptDateTime = new Date(`${apt.date}T${apt.time}`);
        return aptDateTime > now;
    });
    
    // Clear list
    appointmentsList.innerHTML = '';
    
    if (futureAppointments.length === 0) {
        appointmentsList.innerHTML = '<div class="no-appointments">Nenhum agendamento para exibir</div>';
        return;
    }
    
    // Display appointments
    futureAppointments.forEach(apt => {
        const card = createAppointmentCard(apt);
        appointmentsList.appendChild(card);
    });
}

function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card upcoming';
    
    const dateObj = new Date(`${appointment.date}T${appointment.time}`);
    const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const formattedTime = dateObj.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    card.innerHTML = `
        <div class="appointment-date">${formattedDate}</div>
        <div class="appointment-time">⏰ ${formattedTime}</div>
        <div class="appointment-description"><strong>Serviço:</strong> ${appointment.service}</div>
        ${appointment.description ? `<div class="appointment-description"><strong>Descrição:</strong> ${appointment.description}</div>` : ''}
        <div class="appointment-actions">
            <button class="btn-small btn-edit" onclick="editAppointment(${appointment.id})">Editar</button>
            <button class="btn-small btn-delete" onclick="deleteAppointment(${appointment.id})">Cancelar</button>
        </div>
    `;
    
    return card;
}

function editAppointment(id) {
    const appointments = getAppointments();
    const appointment = appointments.find(apt => apt.id === id);
    
    if (appointment) {
        // Populate form with appointment data
        document.getElementById('appointmentDate').value = appointment.date;
        document.getElementById('appointmentTime').value = appointment.time;
        document.getElementById('appointmentService').value = appointment.service;
        document.getElementById('appointmentDescription').value = appointment.description;
        
        // Delete the old appointment
        deleteAppointment(id);
        
        // Scroll to form
        document.querySelector('.booking-section').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('appointmentDate').focus();
    }
}
