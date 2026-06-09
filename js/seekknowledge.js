const questions = [
    {
        name: "Mohammad Ali",
        question: "How can I maintain focus during prayers?",
        answer: "Focus in prayer begins before the prayer itself..."
    },
    {
        name: "Ahmad Ali",
        question: "Guidelines for mindfulness in Ramadan?",
        answer: "Digital minimalism helps reduce distractions..."
    }
];

const container = document.getElementById("questions");

questions.forEach(q => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <h4>${q.name}</h4>
        <p><b>Q:</b> ${q.question}</p>
        <p>${q.answer}</p>
    `;

    container.appendChild(card);
});