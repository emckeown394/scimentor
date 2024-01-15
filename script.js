//header animations
let profile = document.querySelector('.header .flex .prof');

document.querySelector('#user-btn').onclick = () =>{
    profile.classList.toggle('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    profile.classList.remove('active');
    searchForm.classList.remove('active');
}

//view topics button
const viewTopicsButtons = document.querySelectorAll('.inline-btn');

viewTopicsButtons.forEach(button => {
  button.addEventListener('click', function () {
    const subjectId = this.getAttribute('data-subjects-id');
    window.location.href = `/topic/${subjectId}`;
  });
});

// quiz
const questions = [
    {
        question: "Question example?",
        answers: [
            { text: "answer 1", correct: true},
            { text: "answer 2", correct: false},
            { text: "answer 3", correct: false},
            { text: "answer 4", correct: false},
        ]
    }
];


const questionContainer = document.getElementById('question');
const answerButtons = document.getElementById('answer-btns');
const nextButton = document.getElementById('next-btn');

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionContainer.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.array.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
    });
}

startQuiz();

//reveal answer button
document.getElementById('revealButton').addEventListener('click', function() {
    document.getElementById('answer').style.display = 'block';
});

console.log("JavaScript file loaded");