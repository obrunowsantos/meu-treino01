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

function extrairEmbedYoutube(url) {
    try {
        if (url.includes("youtube.com/watch?v=")) {
            return url.replace("watch?v=", "embed/");
        } else if (url.includes("youtube.com/shorts/")) {
            const id = url.split("/shorts/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${id}`;
        } else if (url.includes("youtu.be/")) {
            const id = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${id}`;
        } else {
            return url;
        }
    } catch {
        return url;
    }
}

function salvarExercicio(dia) {
    const nome = document.getElementById('nome').value;
    const grupo = document.getElementById('grupo').value;
    const videoInput = document.getElementById('video').value;
    const video = extrairEmbedYoutube(videoInput);
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