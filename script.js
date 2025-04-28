// Estrutura para salvar usuários e seus treinos
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (users[username] && users[username].password === password) {
        currentUser = username;
        showDays();
    } else {
        alert('Usuário ou senha inválidos!');
    }
}

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    if (!users[username]) {
        users[username] = { password, exercises: {} };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Usuário registrado com sucesso!');
        showLogin();
    } else {
        alert('Usuário já existe!');
    }
}

function showLogin() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('register-container').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'block';
}

function logout() {
    currentUser = null;
    location.reload();
}

function showDays() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('week-container').style.display = 'block';

    const days = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const container = document.getElementById('days');
    container.innerHTML = '';
    days.forEach(day => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = day.charAt(0).toUpperCase() + day.slice(1);
        card.onclick = () => openDay(day);
        container.appendChild(card);
    });
}

function openDay(day) {
    document.getElementById('week-container').style.display = 'none';
    document.getElementById('day-exercises').style.display = 'block';
    document.getElementById('day-title').innerText = day.charAt(0).toUpperCase() + day.slice(1);
    renderExercises(day);
}

function renderExercises(day) {
    const list = document.getElementById('exercises-list');
    list.innerHTML = '';
    const userExercises = users[currentUser].exercises[day] || [];
    userExercises.forEach((ex, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${ex.name}</strong> - ${ex.series} séries - ${ex.group}<br><iframe width="315" height="200" src="${convertYoutubeLink(ex.video)}?autoplay=1&mute=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe><br><button onclick="editExercise('${day}', ${index})">Editar</button>`;
        list.appendChild(div);
    });
}

function backToDays() {
    document.getElementById('week-container').style.display = 'block';
    document.getElementById('day-exercises').style.display = 'none';
}

function showAddExerciseForm() {
    document.getElementById('add-exercise-form').style.display = 'block';
}

function addExercise() {
    const day = document.getElementById('day-select').value;
    const group = document.getElementById('muscle-group-select').value;
    const name = document.getElementById('exercise-name').value;
    const series = document.getElementById('exercise-series').value;
    const video = document.getElementById('exercise-video').value;

    if (!users[currentUser].exercises[day]) {
        users[currentUser].exercises[day] = [];
    }
    users[currentUser].exercises[day].push({ group, name, series, video });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Exercício adicionado!');
    backToDays();
}

function convertYoutubeLink(link) {
    if (link.includes('watch?v=')) {
        return link.replace('watch?v=', 'embed/');
    } else if (link.includes('shorts/')) {
        return link.replace('shorts/', 'embed/');
    }
    return link;
}

function editExercise(day, index) {
    const newName = prompt('Novo nome do exercício:');
    const newSeries = prompt('Novo número de séries:');
    if (newName && newSeries) {
        users[currentUser].exercises[day][index].name = newName;
        users[currentUser].exercises[day][index].series = newSeries;
        localStorage.setItem('users', JSON.stringify(users));
        renderExercises(day);
    }
}
