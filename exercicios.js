document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const dia = params.get('dia');
    document.getElementById('titulo-dia').innerText = `Treino de ${dia}`;

    const lista = document.getElementById('exercicios-lista');
    let exercicios = JSON.parse(localStorage.getItem(dia)) || [];

    exercicios.forEach(nome => {
        const card = document.createElement('div');
        card.className = 'exercicio-card';
        card.innerHTML = `<h3>${nome}</h3>`;
        lista.appendChild(card);
    });
});

function adicionarExercicio() {
    const params = new URLSearchParams(window.location.search);
    const dia = params.get('dia');
    let exercicios = JSON.parse(localStorage.getItem(dia)) || [];

    const nome = prompt("Nome do exercício:");
    if (nome) {
        exercicios.push(nome);
        localStorage.setItem(dia, JSON.stringify(exercicios));
        location.reload();
    }
}