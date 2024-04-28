const subjectId = localStorage.getItem('subjectId'); 
console.log(`Subject ID: ${subjectId}`);

const bioQuizQuestions = [
    { 
        question: "What cell component doesn't appear in both plant and animal cells?", 
        choices: ["Nucleus", "Cytoplasm", "Cell Wall", "Mitrochondria"], 
        correctAnswer: "Cell Wall",
        image: "https://microbenotes.com/wp-content/uploads/2020/02/plant-cell-vs-animal-cell.jpg"
    },
    { 
        question: "What contains the genetic material (DNA) of the organism & controls cell activities?", 
        choices: ["Nucleus", "Cytoplasm", "Cell Membrane", "Mitrochondria"], 
        correctAnswer: "Nucleus",
        image: "https://ichef.bbci.co.uk/images/ic/480xn/p06jq97j.jpg"
    },
    { 
        question: "Name the cell component which are tiny parts of cells floating in the cytoplasm where energy is released from glucose from food?", 
        choices: ["Nucleus", "Cytoplasm", "Cell Membrane", "Mitrochondria"], 
        correctAnswer: "Mitrochondria",
        image: "https://ichef.bbci.co.uk/images/ic/480xn/p06jq97j.jpg"
    },
    { 
        question: "In a plant cell, what cell component is the tough outer layer of the cell, which contains cellulose to provide strength & support to the plant?", 
        choices: ["Cell Wall", "Vacuole", "Chloroplasts"], 
        correctAnswer: "Cell Wall",
        image: "https://cdn.riddle.com/embeds/v2/images/q_80,c_fill,w_960,h_540/3fd/3fdbb4834f6734f256c73f1089fb4e1e.png"
    },
    { 
        question: "What cell component contains a green pigment called chlorophyll in which photosynthesis occurs?", 
        choices: ["Cell Wall", "Vacuole", "Chloroplasts"], 
        correctAnswer: "Chloroplasts",
        image: "https://cdn.riddle.com/embeds/v2/images/q_80,c_fill,w_960,h_540/3fd/3fdbb4834f6734f256c73f1089fb4e1e.png"
    },
    { 
        question: "What is the chemical process in which green plants make their own food using energy from the sun?", 
        choices: ["Glucose", "Respiration", "Photosynthesis"], 
        correctAnswer: "Photosynthesis",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/1200px-Photosynthesis_en.svg.png"
    },
    { 
        question: "What is the missing component needed for photosynthesis? Carbon Dioxide + _________ ---> Glucose + Oxygen", 
        choices: ["Water", "Glucose", "Sugars", "Soil"], 
        correctAnswer: "Water",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/1200px-Photosynthesis_en.svg.png"
    },
    { 
        question: "What diffuses into cells found within the leaf to help carry out the process of photosynthesis", 
        choices: ["Water", "Carbon Dioxide", "Sugars", "Oxygen"], 
        correctAnswer: "Carbon Dioxide",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/1200px-Photosynthesis_en.svg.png"
    },
    { 
        question: "What is released from these cells as a product of photosynthesis?", 
        choices: ["Water", "Carbon Dioxide", "Sugars", "Oxygen"], 
        correctAnswer: "Oxygen",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/1200px-Photosynthesis_en.svg.png"
    },
    { 
        question: "What process is this equation used for? Glucose + Oxygen ---> Carbon Dioxide + Water", 
        choices: ["Photosynthesis", "Respiration"], 
        correctAnswer: "Respiration",
        image: "https://images.squarespace-cdn.com/content/v1/5c5aed8434c4e20e953d6011/1595687697465-F3HYTTI6XPS0XZSXI0CS/aerobic+respiration+equation.jpg"
    },
    { 
        question: "Respiration occurs ______ ?", 
        choices: ["Only during the day", "Only at night", "Day or night"], 
        correctAnswer: "Day or night",
        image: "https://images.squarespace-cdn.com/content/v1/5efc3845201cfd62a7cad809/1601838473715-S3L2LJFFERNH49APGNQS/1280-525742693-photosynthesis.jpg"
    },
    { 
        question: "What system breaks down food into tiny particles which are absorbed into the blood?", 
        choices: ["Respiratory System", "Skeletal System", "Muscular System", "Digestive System"], 
        correctAnswer: "Digestive System",
        image: "https://revere-health.hqdemo.app/wp-content/uploads/66775647_thumbnail.jpg"
    },
    { 
        question: "Which part of the digestive system releases a chemical called bile?", 
        choices: ["Mouth", "Liver", "Stomach", "Rectum"], 
        correctAnswer: "Liver",
        image: "https://www.niddk.nih.gov/-/media/Images/Health-Information/Digestive-Diseases/The_Digestive_System_450x531.jpg"
    },
    { 
        question: "Which part of the digestive system releases enyymes into the intestines?", 
        choices: ["Mouth", "Large Intestine", "Pancreas", "Stomach"], 
        correctAnswer: "Pancreas",
        image: "https://www.niddk.nih.gov/-/media/Images/Health-Information/Digestive-Diseases/The_Digestive_System_450x531.jpg"
    },
    { 
        question: "How many litres of saliva does your mouth produce each day?", 
        choices: ["0.5", "1.5", "3", "10"], 
        correctAnswer: "1.5",
        image: "https://media.istockphoto.com/id/1339361161/vector/salivary-gland-concept.jpg?s=612x612&w=0&k=20&c=BjC1Iu6B1N7a1TaG7GI-csJXTddgqYFRIEUEtF1rXDk="
    },
    { 
        question: "What is produced by your liver and stored in the gall bladder?", 
        choices: ["Saliva", "Faeces", "Villi", "Bile"], 
        correctAnswer: "Bile",
        image: "https://d2jx2rerrg6sh3.cloudfront.net/image-handler/picture/2017/11/shutterstock_165558941.jpg"
    },
];

const scoreImages = {
    low: '/images/quiz_low.png',
    mid: '/images/quiz_mid.png',
    high: '/images/quiz_high.png'
};

let currentQuestionIndex = 0;
let bio_score = 0;

const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const scoreElement = document.getElementById('score');

// display question function
function displayQuestion() {
    // Proceed with displaying the question and choices as before
    const currentQuestion = bioQuizQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    choicesElement.innerHTML = ''; // Clear previous choices

    //display image for question
    const questionImage = document.getElementById('questionImage');
    if (currentQuestion.image) {
        questionImage.src = currentQuestion.image;
        questionImage.alt = "Question image";
        questionImage.style.display = 'block';
    } else {
        questionImage.style.display = 'none';
    }

    // Hide or clear feedback from the previous question
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.style.display = 'none';
    feedbackElement.textContent = '';

    // Update question count
    const questionCount = document.getElementById('questionCount');
    questionCount.textContent = `${currentQuestionIndex + 1}/${bioQuizQuestions.length}`;

    currentQuestion.choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.textContent = choice;
        choiceButton.classList.add('choice-button');
        choiceButton.classList.remove('correct', 'incorrect');
        choiceButton.disabled = false;
        choiceButton.addEventListener('click', () => selectChoice(choice));
        choicesElement.appendChild(choiceButton);
    });
}

// select choice function
function selectChoice(chosenAnswer) {
    //display feedback (correct/incorrect answers)
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.style.display = 'block';

    if (chosenAnswer === bioQuizQuestions[currentQuestionIndex].correctAnswer) {
        bio_score++;
        feedbackElement.textContent = '✓ Correct!';
        feedbackElement.style.color = 'green';
    } else {
        feedbackElement.textContent = 'X Incorrect!';
        feedbackElement.style.color = 'red';
    }

    // Disable all choices and highlight correct answer
    const choicesButtons = document.querySelectorAll('.choice-button');
    choicesButtons.forEach(button => {
        button.disabled = true; // Prevent further clicks
        if (button.textContent === bioQuizQuestions[currentQuestionIndex].correctAnswer) {
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
        }
    });

    // Display the Next button
    document.getElementById('nextQuestion').style.display = 'block';
}

document.getElementById('nextQuestion').addEventListener('click', function() {
    currentQuestionIndex++;
    if (currentQuestionIndex < bioQuizQuestions.length) {
        displayQuestion(); // Display the next question
    } else {
        displayScore(); // Or display the final score if it was the last question
    }
    this.style.display = 'none'; // Hide the Next button again
});

// display score function
function displayScore() {
    const studentId = localStorage.getItem('studentId'); 
    questionElement.style.display = 'none';
    choicesElement.innerHTML = ''; 

    // Calculate score percentage
    const scorePercentage = (bio_score / bioQuizQuestions.length) * 100;

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
    scoreDisplay.textContent = `Your score: ${bio_score}/${bioQuizQuestions.length}`;
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

    console.log(`Student ID: ${studentId}, Biology Score: ${bio_score}`);

    //send students score to database
    sendScore(studentId, bio_score);
}

// retake quiz function
function retakeQuiz() {
    //reset quiz state
    currentQuestionIndex = 0;
    bio_score = 0;
    // Clear score and buttons
    scoreElement.innerHTML = ''; 
    // Ensure questions and choices are visible
    questionElement.style.display = 'block';
    // Show the first question again
    displayQuestion(); 
}

//button to exit quiz
function addExitButton() {
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit Quiz';
    exitButton.classList.add('exit-btn');
    exitButton.addEventListener('click', () => window.location.href = '/homepage');
    document.body.appendChild(exitButton);
}

displayQuestion();
addExitButton();

// send score function
function sendScore(studentId, bio_score) {
    fetch('/api/biology_scores', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentId: studentId, bio_score: bio_score})
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