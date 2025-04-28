// script.js atualizado e corrigido

// Função para adicionar um exercício
function addExercise() {
    const name = document.getElementById('exercise-name').value;
    const series = document.getElementById('exercise-series').value;
    const video = document.getElementById('exercise-video').value;
    const group = document.getElementById('exercise-group').value;

    if (name && series && video && group) {
        const exercise = { name, series, video, group };
        let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
        exercises.push(exercise);
        localStorage.setItem('exercises', JSON.stringify(exercises));
        displayExercises();
        clearForm();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para exibir exercícios
function displayExercises() {
    const container = document.getElementById('exercises');
    container.innerHTML = '';

    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];

    const groups = {};
    exercises.forEach(exercise => {
        if (!groups[exercise.group]) {
            groups[exercise.group] = [];
        }
        groups[exercise.group].push(exercise);
    });

    for (const group in groups) {
        const groupDiv = document.createElement('div');
        const groupTitle = document.createElement('h2');
        groupTitle.textContent = group;
        groupDiv.appendChild(groupTitle);

        groups[group].forEach(exercise => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise';

            const namePara = document.createElement('p');
            namePara.innerHTML = `<strong>Nome:</strong> ${exercise.name}`;

            const seriesPara = document.createElement('p');
            seriesPara.innerHTML = `<strong>Séries:</strong> ${exercise.series}`;

            const iframeContainer = document.createElement('div');
            iframeContainer.innerHTML = exercise.video;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteExercise(exercise.name);

            exerciseDiv.appendChild(namePara);
            exerciseDiv.appendChild(seriesPara);
            exerciseDiv.appendChild(iframeContainer);
            exerciseDiv.appendChild(deleteButton);

            groupDiv.appendChild(exerciseDiv);
        });

        container.appendChild(groupDiv);
    }
}

// Função para limpar o formulário
function clearForm() {
    document.getElementById('exercise-name').value = '';
    document.getElementById('exercise-series').value = '';
    document.getElementById('exercise-video').value = '';
    document.getElementById('exercise-group').value = '';
}

// Função para excluir um exercício
function deleteExercise(name) {
    let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    exercises = exercises.filter(exercise => exercise.name !== name);
    localStorage.setItem('exercises', JSON.stringify(exercises));
    displayExercises();
}

// Função para limpar todos os exercícios
function clearAllExercises() {
    if (confirm('Tem certeza que deseja excluir todos os exercícios?')) {
        localStorage.removeItem('exercises');
        displayExercises();
    }
}

// Eventos
window.onload = () => {
    displayExercises();
    document.getElementById('add-exercise').onclick = addExercise;
    document.getElementById('clear-exercises').onclick = clearAllExercises;
};
