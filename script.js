
// JavaScript adaptado para novo estilo de treino
const usersData = {};

document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        localStorage.setItem('currentUser', username);
        if (!localStorage.getItem(username)) {
            localStorage.setItem(username, JSON.stringify({}));
        }
        showApp();
    }
});

function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('user-title').innerText = "Bem-vindo, " + localStorage.getItem('currentUser');
    loadDays();
}

function loadDays() {
    const days = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
    const container = document.getElementById('days-container');
    container.innerHTML = '';

    days.forEach(day => {
        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerText = day;
        card.onclick = () => openDay(day);
        container.appendChild(card);
    });
}

function openDay(day) {
    document.getElementById('days-container').style.display = 'none';
    document.getElementById('day-exercises').style.display = 'block';
    document.getElementById('day-title').innerText = day;
    loadExercises(day);
}

function loadExercises(day) {
    const user = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem(user)) || {};
    const exercises = userData[day] || [];

    const container = document.getElementById('exercises');
    container.innerHTML = '';

    exercises.forEach((ex, idx) => {
        const exDiv = document.createElement('div');
        exDiv.className = 'exercise';
        exDiv.innerHTML = `<strong>${ex.name}</strong> - ${ex.series} (${ex.group})<br>
        <a href="${ex.video}" target="_blank" class="youtube-video">Assistir</a>
        <br><button onclick="startRestTimer(${idx}, '${day}')">Descanso</button>`;
        container.appendChild(exDiv);
    });
}

function startRestTimer(idx, day) {
    const timer = document.createElement('div');
    timer.className = 'timer';
    let seconds = 90;
    timer.innerText = `Descanso: 90 segundos`;
    document.querySelectorAll('.exercise')[idx].appendChild(timer);

    const interval = setInterval(() => {
        seconds--;
        timer.innerText = `Descanso: ${seconds} segundos`;
        if (seconds <= 0) {
            clearInterval(interval);
            timer.innerText = "Descanso finalizado!";
            alert("Descanso finalizado!");
        }
    }, 1000);
}

document.getElementById('add-exercise').addEventListener('click', () => {
    const name = document.getElementById('exercise-name').value.trim();
    const series = document.getElementById('exercise-series').value.trim();
    const video = document.getElementById('exercise-video').value.trim();
    const group = document.getElementById('exercise-group').value.trim();
    const day = document.getElementById('day-title').innerText;

    if (name && series && video) {
        const user = localStorage.getItem('currentUser');
        const userData = JSON.parse(localStorage.getItem(user)) || {};
        if (!userData[day]) {
            userData[day] = [];
        }
        userData[day].push({ name, series, video, group });
        localStorage.setItem(user, JSON.stringify(userData));
        document.getElementById('exercise-name').value = '';
        document.getElementById('exercise-series').value = '';
        document.getElementById('exercise-video').value = '';
        document.getElementById('exercise-group').value = '';
        backToDays();
    }
});

document.getElementById('clear-exercises').addEventListener('click', () => {
    const day = document.getElementById('day-title').innerText;
    const user = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem(user)) || {};
    userData[day] = [];
    localStorage.setItem(user, JSON.stringify(userData));
    loadExercises(day);
});

document.getElementById('back-button').addEventListener('click', backToDays);

function backToDays() {
    document.getElementById('days-container').style.display = 'grid';
    document.getElementById('day-exercises').style.display = 'none';
    loadDays();
}

window.onload = () => {
    if (localStorage.getItem('currentUser')) {
        showApp();
    }
};
