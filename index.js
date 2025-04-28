document.addEventListener("DOMContentLoaded", () => {
    const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const container = document.getElementById('dias-da-semana');

    diasDaSemana.forEach(dia => {
        const card = document.createElement('div');
        card.className = 'dia-card';
        card.innerHTML = `<h2>${dia}</h2>`;
        card.onclick = () => {
            window.location.href = `exercicios.html?dia=${encodeURIComponent(dia)}`;
        };
        container.appendChild(card);
    });
});