
let currentUser = '';
let currentDay = '';

document.getElementById('login-button').onclick = () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        currentUser = username;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('user-title').textContent = `Treino de: ${currentUser}`;
        displayDays();
    } else {
        alert('Por favor, insira um nome de usuário.');
    }
};

const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function displayDays() {
    document.getElementById('day-exercises').style.display = 'none';
    const container = document.getElementById('days-container');
    container.innerHTML = '';

    const exercises = JSON.parse(localStorage.getItem(currentUser)) || [];
    const dayGroups = {};

    weekDays.forEach(day => {
        const dayExercises = exercises.filter(ex => ex.day === day);
        let group = dayExercises.length > 0 ? dayExercises[0].group : 'Nenhum';

        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerHTML = `<h3>${day}</h3><p><strong>Grupo:</strong> ${group}</p>`;
        card.onclick = () => openDay(day);
        container.appendChild(card);
    });
}

function openDay(day) {
    currentDay = day;
    document.getElementById('day-exercises').style.display = 'block';
    document.getElementById('days-container').style.display = 'none';
    document.getElementById('day-title').textContent = day;
    displayExercises();
}

function displayExercises() {
    const container = document.getElementById('exercises');
    container.innerHTML = '';
    const exercises = JSON.parse(localStorage.getItem(currentUser)) || [];
    const filtered = exercises.filter(ex => ex.day === currentDay);

    filtered.forEach(exercise => {
        const div = document.createElement('div');
        div.className = 'exercise';
        div.innerHTML = `
            <p><strong>Nome:</strong> ${exercise.name}</p>
            <p><strong>Séries:</strong> ${exercise.series}</p>
            <div>${exercise.video}</div>
            <button onclick="deleteExercise('${exercise.name}')">Excluir</button>
            <button onclick="startTimer(this)">Iniciar Descanso (90s)</button>
        `;
        container.appendChild(div);
    });
}

function addExercise() {
    const name = document.getElementById('exercise-name').value;
    const series = document.getElementById('exercise-series').value;
    const videoLink = document.getElementById('exercise-video').value;
    const group = document.getElementById('exercise-group').value;

    if (name && series && videoLink && group) {
        const videoId = extractYouTubeId(videoLink);
        if (!videoId) {
            alert('Link do YouTube inválido!');
            return;
        }
        const iframe = `<iframe width="315" height="177" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        const exercise = { name, series, video: iframe, group, day: currentDay };
        let exercises = JSON.parse(localStorage.getItem(currentUser)) || [];
        exercises.push(exercise);
        localStorage.setItem(currentUser, JSON.stringify(exercises));
        displayDays();
        clearForm();
    } else {
        alert('Preencha todos os campos.');
    }
}

function extractYouTubeId(url) {
    let videoId = null;
    if (url.includes('shorts/')) {
        const parts = url.split('shorts/');
        videoId = parts[1]?.split('?')[0];
    } else {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length == 11) {
            videoId = match[2];
        }
    }
    return videoId;
}

function deleteExercise(name) {
    let exercises = JSON.parse(localStorage.getItem(currentUser)) || [];
    exercises = exercises.filter(exercise => !(exercise.name === name && exercise.day === currentDay));
    localStorage.setItem(currentUser, JSON.stringify(exercises));
    displayExercises();
}

function startTimer(button) {
    let timerDiv = document.createElement('div');
    timerDiv.className = 'timer';
    button.parentNode.appendChild(timerDiv);

    let seconds = 90;
    timerDiv.textContent = `Descanso: ${seconds}s`;
    const interval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            timerDiv.textContent = `Descanso: ${seconds}s`;
        } else {
            clearInterval(interval);
            timerDiv.textContent = 'Descanso finalizado!';
            document.getElementById('beep-sound').play();
        }
    }, 1000);
}

function clearForm() {
    document.getElementById('exercise-name').value = '';
    document.getElementById('exercise-series').value = '';
    document.getElementById('exercise-video').value = '';
    document.getElementById('exercise-group').value = '';
}

function clearAllExercises() {
    if (confirm('Tem certeza que deseja excluir todos os exercícios?')) {
        localStorage.removeItem(currentUser);
        displayDays();
    }
}

document.getElementById('add-exercise').onclick = addExercise;
document.getElementById('clear-exercises').onclick = clearAllExercises;
document.getElementById('back-button').onclick = () => {
    document.getElementById('days-container').style.display = 'grid';
    displayDays();
};
