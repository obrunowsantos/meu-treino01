let currentUser = null;
let currentDay = null;
let editingExerciseIndex = null;

// Dados de login (simples)
const users = [
    { username: "admin", password: "1234" },
    { username: "user", password: "abcd" }
];

// Fazer login
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = username;
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('week-section').classList.remove('hidden');
        renderDays();
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

// Renderizar dias da semana
function renderDays() {
    const daysGrid = document.getElementById('days-grid');
    daysGrid.innerHTML = '';

    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    days.forEach(day => {
        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerHTML = `<h3>${day}</h3>`;
        card.onclick = () => openDay(day);
        daysGrid.appendChild(card);
    });
}

// Abrir exercícios de um dia
function openDay(day) {
    currentDay = day;
    document.getElementById('week-section').classList.add('hidden');
    document.getElementById('day-exercises-section').classList.remove('hidden');
    document.getElementById('day-title').innerText = `Treino de ${day}`;
    renderExercises();
}

// Voltar para dias
function goBack() {
    document.getElementById('day-exercises-section').classList.add('hidden');
    document.getElementById('week-section').classList.remove('hidden');
}

// Renderizar exercícios
function renderExercises() {
    const exercisesList = document.getElementById('exercises-list');
    exercisesList.innerHTML = '';

    const exercises = getExercisesForDay(currentDay);

    exercises.forEach((ex, index) => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.innerHTML = `
            <p><strong>Grupo:</strong> ${ex.group}</p>
            <p><strong>Exercício:</strong> ${ex.name}</p>
            <p><strong>Séries:</strong> ${ex.series}</p>
            <div class="exercise-buttons">
                <button onclick="editExercise(${index})">Editar</button>
                <button class="clear-button" onclick="deleteExercise(${index})">Excluir</button>
            </div>
            <div style="margin-top:10px;">
                <iframe width="100%" height="200" src="${formatYouTubeLink(ex.video)}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
        `;
        exercisesList.appendChild(card);
    });
}

// Formatar link do YouTube
function formatYouTubeLink(link) {
    const videoId = link.split('v=')[1]?.split('&')[0] || link.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
}

// Mostrar formulário de adicionar
function showAddExerciseForm(editIndex = null) {
    document.getElementById('exercise-form').classList.remove('hidden');
    editingExerciseIndex = editIndex;
    if (editIndex !== null) {
        const exercises = getExercisesForDay(currentDay);
        const ex = exercises[editIndex];
        document.getElementById('day-select').value = currentDay;
        document.getElementById('group-select').value = ex.group;
        document.getElementById('exercise-name').value = ex.name;
        document.getElementById('exercise-series').value = ex.series;
        document.getElementById('exercise-video').value = ex.video;
        document.getElementById('form-title').innerText = "Editar Exercício";
    } else {
        document.getElementById('day-select').value = currentDay;
        document.getElementById('group-select').value = '';
        document.getElementById('exercise-name').value = '';
        document.getElementById('exercise-series').value = '';
        document.getElementById('exercise-video').value = '';
        document.getElementById('form-title').innerText = "Novo Exercício";
    }
}

// Salvar novo exercício ou edição
function saveExercise() {
    const day = document.getElementById('day-select').value;
    const group = document.getElementById('group-select').value;
    const name = document.getElementById('exercise-name').value.trim();
    const series = document.getElementById('exercise-series').value.trim();
    const video = document.getElementById('exercise-video').value.trim();

    if (!day || !group || !name || !series || !video) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const allExercises = JSON.parse(localStorage.getItem('exercises') || '{}');

    if (!allExercises[day]) {
        allExercises[day] = [];
    }

    const newExercise = { group, name, series, video };

    if (editingExerciseIndex !== null) {
        allExercises[day][editingExerciseIndex] = newExercise;
    } else {
        allExercises[day].push(newExercise);
    }

    localStorage.setItem('exercises', JSON.stringify(allExercises));

    document.getElementById('exercise-form').classList.add('hidden');
    editingExerciseIndex = null;
    openDay(day);
}

// Obter exercícios
function getExercisesForDay(day) {
    const allExercises = JSON.parse(localStorage.getItem('exercises') || '{}');
    return allExercises[day] || [];
}

// Deletar exercício
function deleteExercise(index) {
    if (!confirm('Deseja realmente excluir este exercício?')) return;

    const allExercises = JSON.parse(localStorage.getItem('exercises') || '{}');
    if (allExercises[currentDay]) {
        allExercises[currentDay].splice(index, 1);
        localStorage.setItem('exercises', JSON.stringify(allExercises));
        renderExercises();
    }
}

// Limpar todos os exercícios
function clearExercises() {
    if (!confirm('Deseja realmente limpar todos os exercícios?')) return;

    const allExercises = JSON.parse(localStorage.getItem('exercises') || '{}');
    allExercises[currentDay] = [];
    localStorage.setItem('exercises', JSON.stringify(allExercises));
    renderExercises();
}

// Editar exercício
function editExercise(index) {
    showAddExerciseForm(index);
}
