const form = document.getElementById('exercise-form');
const list = document.getElementById('exercise-list');

// Carrega os exercícios do LocalStorage ao iniciar
let exercises = JSON.parse(localStorage.getItem('exercises')) || [];

// Atualiza a lista inicial
updateList();

// Ao enviar o formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('exercise-name').value;
  const series = document.getElementById('exercise-series').value;
  const video = document.getElementById('exercise-video').value;
  const group = document.getElementById('exercise-group').value;

  const exercise = { name, series, video, group };
  exercises.push(exercise);
  saveExercises();
  updateList();
  form.reset();
});

// Atualiza a exibição dos exercícios
function updateList() {
  list.innerHTML = '';

  // Organiza exercícios por grupo muscular
  const groups = {};

  exercises.forEach(ex => {
    if (!groups[ex.group]) {
      groups[ex.group] = [];
    }
    groups[ex.group].push(ex);
  });

  // Para cada grupo, cria um título e lista os exercícios
  for (const group in groups) {
    const groupTitle = document.createElement('h2');
    groupTitle.textContent = group;
    list.appendChild(groupTitle);

    groups[group].forEach((ex, index) => {
      const card = document.createElement('div');
      card.className = 'exercise-card';
      card.innerHTML = `
        <h3>${ex.name}</h3>
        <p><strong>Séries:</strong> ${ex.series}</p>
        <iframe src="${ex.video}" frameborder="0" allowfullscreen></iframe>
        <br><br>
        <button onclick="deleteExercise(${exercises.indexOf(ex)})">Excluir</button>
      `;
      list.appendChild(card);
    });
  }
}

// Exclui um exercício
function deleteExercise(index) {
  exercises.splice(index, 1);
  saveExercises();
  updateList();
}

// Salva os exercícios no LocalStorage
function saveExercises() {
  localStorage.setItem('exercises', JSON.stringify(exercises));
}

// Botão para limpar todos os exercícios
const clearButton = document.getElementById('clear-all');

clearButton.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja apagar TODOS os exercícios?')) {
    exercises = [];
    saveExercises();
    updateList();
  }
});
