
const diasSemana = document.getElementById('dias-semana');
const modal = document.getElementById('modal');
const form = document.getElementById('form-exercicio');
const btnAdicionar = document.getElementById('adicionar-exercicio');
const btnCancelar = document.getElementById('cancelar');
const btnLimpar = document.getElementById('limpar-todos');

let treinos = JSON.parse(localStorage.getItem('treinos')) || {};

function salvarTreinos() {
    localStorage.setItem('treinos', JSON.stringify(treinos));
}

function renderizarDias() {
    diasSemana.innerHTML = '';
    const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    dias.forEach(dia => {
        const card = document.createElement('div');
        card.className = 'card-dia';
        card.innerHTML = `<h3>${dia}</h3>`;

        if (treinos[dia]) {
            card.innerHTML += `<p><strong>Grupo:</strong> ${treinos[dia].grupo}</p>`;
            treinos[dia].exercicios.forEach(exercicio => {
                const exercicioDiv = document.createElement('div');
                exercicioDiv.innerHTML = `
                    <h4>${exercicio.nome}</h4>
                    <p><strong>Séries:</strong> ${exercicio.series}</p>
                    <iframe src="https://www.youtube.com/embed/${extrairVideoID(exercicio.link)}?autoplay=1&mute=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                `;
                card.appendChild(exercicioDiv);
            });
        }

        diasSemana.appendChild(card);
    });
}

function extrairVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

btnAdicionar.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

btnCancelar.addEventListener('click', () => {
    modal.classList.add('hidden');
    form.reset();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dia = document.getElementById('dia').value.trim();
    const grupo = document.getElementById('grupo').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const series = document.getElementById('series').value.trim();
    const link = document.getElementById('link').value.trim();

    if (!treinos[dia]) {
        treinos[dia] = { grupo: grupo, exercicios: [] };
    } else {
        treinos[dia].grupo = grupo;
    }

    treinos[dia].exercicios.push({ nome, series, link });
    salvarTreinos();
    modal.classList.add('hidden');
    form.reset();
    renderizarDias();
});

btnLimpar.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todos os exercícios?')) {
        treinos = {};
        salvarTreinos();
        renderizarDias();
    }
});

renderizarDias();
