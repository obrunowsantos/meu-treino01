document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const dia = params.get('dia');
    document.getElementById('titulo-dia').innerText = `Treino de ${dia}`;

    carregarExercicios(dia);

    document.getElementById('formulario-exercicio').addEventListener('submit', function(event) {
        event.preventDefault();
        salvarExercicio(dia);
    });
});

function carregarExercicios(dia) {
    const lista = document.getElementById('exercicios-lista');
    lista.innerHTML = "";
    const exercicios = JSON.parse(localStorage.getItem(dia)) || [];

    exercicios.forEach((exercicio, index) => {
        const card = document.createElement('div');
        card.className = 'exercicio-card';
        card.innerHTML = `
            <h3>${exercicio.nome}</h3>
            <p><strong>Grupo:</strong> ${exercicio.grupo}</p>
            <p><strong>Séries:</strong> ${exercicio.series}</p>
            <iframe width="250" height="150" src="${exercicio.video}" frameborder="0" allowfullscreen></iframe>
        `;
        lista.appendChild(card);
    });
}

function mostrarFormulario() {
    document.getElementById('formulario-exercicio').style.display = 'flex';
}

function salvarExercicio(dia) {
    const nome = document.getElementById('nome').value;
    const grupo = document.getElementById('grupo').value;
    const video = document.getElementById('video').value.replace("watch?v=", "embed/");
    const series = document.getElementById('series').value;

    if (nome && grupo && video && series) {
        const novoExercicio = { nome, grupo, video, series };
        const exercicios = JSON.parse(localStorage.getItem(dia)) || [];
        exercicios.push(novoExercicio);
        localStorage.setItem(dia, JSON.stringify(exercicios));
        location.reload();
    } else {
        alert("Preencha todos os campos!");
    }
}