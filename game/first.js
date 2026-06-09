const questions = [
{
question: "Before prayer, a Muslim must purify from...",
answers: ["Major and minor impurity","Only minor impurity","Only major impurity","Nothing"],
correct: 0
},
{
question: "Major impurity is removed by...",
answers: ["Wudu","Ghusl","Sleeping","Tayammum"],
correct: 1
},
{
question: "If water is not available, what replaces Wudu?",
answers: ["Ghusl","Nothing","Tayammum","Sleeping"],
correct: 2
},
{
question: "How many times is the face washed?",
answers: ["Once","Twice","Three times","Four times"],
correct: 2
},
{
question: "Deep sleep breaks...",
answers: ["Prayer","Wudu","Fast","Nothing"],
correct: 1
}
];

let current = 0;
let score = 0;
let lives = 3;
const levelNumber = 1;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const feedbackEl = document.getElementById("feedback");
const restartBtn = document.getElementById("restart");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const winSound = document.getElementById("winSound");

function loadQuestion(){
    if(current >= questions.length || lives === 0){
        endGame();
        return;
    }

    const q = questions[current];
    questionEl.textContent = q.question;
    answersEl.innerHTML = "";
    feedbackEl.textContent = "";

    q.answers.forEach((ans,index)=>{
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.onclick = ()=>checkAnswer(index);
        answersEl.appendChild(btn);
    });
}

function checkAnswer(index){
    if(index === questions[current].correct){
        score += 10;
        correctSound.play();
        feedbackEl.textContent = "Correct! ✅";
        feedbackEl.style.color = "green";
    }else{
        lives--;
        wrongSound.play();
        feedbackEl.textContent = "Wrong! ❌";
        feedbackEl.style.color = "red";
    }

    scoreEl.textContent = score;
    livesEl.textContent = lives;

    current++;
    setTimeout(loadQuestion,1000);
}


function endGame(){

    const maxScore = questions.length * 10;

    const percentage =
    (score / maxScore) * 100;

    if(percentage >= 50){

        localStorage.setItem(
            `level${levelNumber}Passed`,
            "true"
        );

    }else{

        localStorage.setItem(
            `level${levelNumber}Passed`,
            "false"
        );

    }

    localStorage.setItem(
        `level${levelNumber}Score`,
        score
    );

    questionEl.textContent =
        lives === 0 ?
        "Game Over!" :
        "Congratulations!";

    answersEl.innerHTML = "";

    feedbackEl.textContent =
        `Final Score: ${score} (${Math.round(percentage)}%)`;

    winSound.play();

    restartBtn.classList.remove("hidden");
}

restartBtn.onclick = function(){
    current = 0;
    score = 0;
    lives = 3;
    scoreEl.textContent = 0;
    livesEl.textContent = 3;
    restartBtn.classList.add("hidden");
    loadQuestion();
}

loadQuestion();