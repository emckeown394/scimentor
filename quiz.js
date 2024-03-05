const subjectId = localStorage.getItem('subjectId'); 
console.log(`Subject ID: ${subjectId}`);

fetch(`/api/quiz/${subjectId}`)
  .then(response => response.json())
  .then(quizData => {
    console.log(quizData);
    initializeQuiz(quizData);
  })
  .catch(error => console.error('Failed to load quiz data:', error));
  
  function initializeQuiz(quizQuestions) {
    // Assuming quizQuestions is an array of question objects
    window.quizQuestions = quizQuestions; // Making it globally accessible for other functions
    displayQuestion(); // Display the first question
}

const scoreImages = {
    low: '/images/quiz_low.png',
    mid: '/images/quiz_mid.png',
    high: '/images/quiz_high.png'
};

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const scoreElement = document.getElementById('score');

function displayQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        displayScore();
        return;
    }

    choiceButton.onclick = () => selectChoice(choice.is_correct === 1);

    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question_text;
    choicesElement.innerHTML = ''; // Clear previous choices
    
    // Display image for the question, if there is one
    const questionImage = document.getElementById('questionImage');
    questionImage.src = currentQuestion.image || '';
    questionImage.style.display = currentQuestion.image ? 'block' : 'none';
    
    // Dynamically create choice buttons
    currentQuestion.choices.forEach((choice, index) => {
        const choiceButton = document.createElement('button');
        choiceButton.textContent = choice.choice_text;
        choiceButton.classList.add('choice-button');
        choiceButton.onclick = () => selectChoice(choice.is_correct);
        choicesElement.appendChild(choiceButton);
    });

    // Update question count display
    const questionCount = document.getElementById('questionCount');
    questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    
}

function selectChoice(isCorrect) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.style.display = 'block';

    if (isCorrect) {
        score++;
        feedbackElement.textContent = '✓ Correct!';
        feedbackElement.style.color = 'green';
    } else {
        feedbackElement.textContent = 'X Incorrect!';
        feedbackElement.style.color = 'red';
    }

    document.querySelectorAll('.choice-button').forEach(button => button.disabled = true); // Disable choices
    document.getElementById('nextQuestion').style.display = 'block'; // Show next button
}

document.getElementById('nextQuestion').addEventListener('click', function() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion(); // Display the next question
    } else {
        displayScore(); // Or display the final score if it was the last question
    }
    this.style.display = 'none'; // Hide the Next button again
});

function displayScore() {
    const student_id = localStorage.getItem('studentId'); 
    questionElement.style.display = 'none';
    choicesElement.innerHTML = ''; 

    // Calculate score percentage
    const scorePercentage = (score / quizQuestions.length) * 100;

    // Select the appropriate image based on the score
    let selectedImage;
    if (scorePercentage < 60) {
        selectedImage = scoreImages.low;
    } else if (scorePercentage < 100) {
        selectedImage = scoreImages.mid;
    } else {
        selectedImage = scoreImages.high;
    }

    // Display the selected image
    const resultImage = document.createElement('img');
    resultImage.src = selectedImage;
    resultImage.alt = "Quiz Result";
    resultImage.style.width = '300px';
    resultImage.style.display = 'block';
    resultImage.style.margin = '0 auto';
    scoreElement.appendChild(resultImage);

    //hide feedback
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.style.display = 'none';

    //hide image
    const questionImage = document.getElementById('questionImage');
    questionImage.style.display = 'none';

    //hide question count
    questionCount.style.display = 'none';

    //hide next button
    const nextQuestion = document.getElementById('nextQuestion');
    nextQuestion.style.display = 'none';

    //display final score
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

    //send students score to database
    sendScore(student_id, score);
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

function sendScore(student_id, score) {
    fetch('api/biology_scores', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({student_id, score})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network reponse was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success', data);
    })
    .catch((error) => {
        console.error('Error', error);
    });
}