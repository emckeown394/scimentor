const quizQuestions = [
    { 
        question: "What is 2 + 2?", 
        choices: ["2", "3", "4", "5"], 
        correctAnswer: "4",
        image: "https://qph.cf2.quoracdn.net/main-qimg-ea1700e6eab7fdc566bd9c81b42f6453-lq"
    },
    { 
        question: "What is the capital of France?", 
        choices: ["Paris", "London", "Berlin", "Madrid"], 
        correctAnswer: "Paris",
        image: ""
    },
    { 
        question: "What is the closest planet to the Sun?", 
        choices: ["Mars", "Saturn", "Neptune", "Mercury"], 
        correctAnswer: "Mercury",
        image: ""
    },
];

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const scoreElement = document.getElementById('score');

function displayQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    choicesElement.innerHTML = '';

    // Display the image
    const questionImage = document.getElementById('questionImage');
    if (currentQuestion.image) {
        questionImage.src = currentQuestion.image;
        questionImage.style.display = 'block';
    } else {
        questionImage.style.display = 'none';
    }

    currentQuestion.choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.textContent = choice;
        choiceButton.classList.add('choice-button');
        choiceButton.addEventListener('click', () => selectChoice(choice));

        choicesElement.appendChild(choiceButton);
    });
}

function selectChoice(chosenAnswer) {
    const correctAnswer = quizQuestions[currentQuestionIndex].correctAnswer;

    if (chosenAnswer === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        displayScore();
    }
}

function displayScore() {
    questionElement.style.display = 'none';
    choicesElement.innerHTML = ''; 

    const scoreDisplay = document.createElement('div');
    scoreDisplay.textContent = `Your score: ${score}/${quizQuestions.length}`;
    scoreElement.appendChild(scoreDisplay);

    // Create and append the Retake Quiz button
    const retakeButton = document.createElement('button');
    retakeButton.textContent = 'Retake Quiz';
    retakeButton.classList.add('retake-btn');
    retakeButton.addEventListener('click', retakeQuiz);
    scoreElement.appendChild(retakeButton);

    // Create and append the Go to Homepage button
    const homeButton = document.createElement('button');
    homeButton.textContent = 'Homepage';
    homeButton.classList.add('home-btn');
    homeButton.addEventListener('click', () => window.location.href = '/homepage');
    scoreElement.appendChild(homeButton);
}

function retakeQuiz() {
    //reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    // Clear score and buttons
    scoreElement.innerHTML = ''; 
    // Ensure questions and choices are visible
    questionElement.style.display = 'block';
    // Show the first question again
    displayQuestion(); 
}

displayQuestion();