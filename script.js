let currentUser = '';

document.getElementById('login-button').onclick = () => {
  const username = document.getElementById('username').value.trim();
  if (username) {
    currentUser = username;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('user-title').textContent = `Treino de: ${currentUser}`;
    displayExercises();
  } else {
    alert('Por favor, insira um nome de usuário.');
  }
};

function addExercise() {
  const name = document.getElementById('exercise-name').value;
  const series = document.getElementById('exercise-series').value;
  const video = document.getElementById('exercise-video').value;
  const group = document.getElementById('exercise-group').value;
  const day = document.getElementById('exercise-day').value;

  if (name && series && video && group && day) {
    const exercise = { name, series, video, group, day };
    let exercises = JSON.parse(localStorage.getItem(currentUser)) || [];
    exercises.push(exercise);
    localStorage.setItem(currentUser, JSON.stringify(exercises));
    displayExercises();
    clearForm();
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

function displayExercises() {
  const container = document.getElementById('exercises');
  container.innerHTML = '';

  const exercises = JSON.parse(localStorage.getItem(currentUser)) || [];

  const days = {};
  exercises.forEach(exercise => {
    if (!days[exercise.day]) {
      days[exercise.day] = [];
    }
    days[exercise.day].push(exercise);
  });

  for (const day in days) {
    const dayDiv = document.createElement('div');
    const dayTitle = document.createElement('h2');
    dayTitle.textContent = day;
    dayDiv.appendChild(dayTitle);

    const groups = {};
    days[day].forEach(exercise => {
      if (!groups[exercise.group]) {
        groups[exercise.group] = [];
      }
      groups[exercise.group].push(exercise);
    });

    for (const group in groups) {
      const groupDiv = document.createElement('div');
      const groupTitle = document.createElement('h3');
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

        const timerButton = document.createElement('button');
        timerButton.textContent = 'Iniciar Descanso (90s)';
        timerButton.onclick = () => startTimer(exerciseDiv);

        exerciseDiv.appendChild(namePara);
        exerciseDiv.appendChild(seriesPara);
        exerciseDiv.appendChild(iframeContainer);
        exerciseDiv.appendChild(deleteButton);
        exerciseDiv.appendChild(timerButton);

        groupDiv.appendChild(exerciseDiv);
      });

      dayDiv.appendChild(groupDiv);
    }

    container.appendChild(dayDiv);
  }
}

function clearForm() {
  document.getElementById('exercise-name').value = '';
  document.getElementById('exercise-series').value = '';
  document.getElementById('exercise-video').value = '';
  document.getElementById('exercise-group').value = '';
  document.getElementById('exercise-day').value = '';
}

function deleteExercise(name) {
  let exercises = JSON.parse(localStorage.getItem(currentUser)) || [];
  exercises = exercises.filter(exercise => exercise.name !== name);
  localStorage.setItem(currentUser, JSON.stringify(exercises));
  displayExercises();
}

function clearAllExercises() {
  if (confirm('Tem certeza que deseja excluir todos os exercícios?')) {
    localStorage.removeItem(currentUser);
    displayExercises();
  }
}

function startTimer(container) {
  const timer = document.createElement('div');
  timer.className = 'timer';
  let seconds = 90;
  timer.textContent = `Descanso: ${seconds}s`;
  container.appendChild(timer);

  const interval = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      timer.textContent = `Descanso: ${seconds}s`;
    } else {
      clearInterval(interval);
      timer.textContent = 'Descanso finalizado!';
      document.getElementById('beep-sound').play();
    }
  }, 1000);
}

window.onload = () => {
  document.getElementById('add-exercise').onclick = addExercise;
  document.getElementById('clear-exercises').onclick = clearAllExercises;
};
