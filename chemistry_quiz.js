const chemQuizQuestions = [
    { 
        question: "What material is a good conductor of heat & electricity?", 
        choices: ["Metals", "Plastics", "Glass", "Wood", "Fabrics"], 
        correctAnswer: "Metals",
        image: "https://d1uvxqwmcz8fl1.cloudfront.net/tes/resources/11310181/ea0266e6-5cdd-4e93-be12-6e1f84f0b049/image?width=500&height=500&version=1663665026912"
    },
    { 
        question: "What material is made by melting sand and other materials at very high temperatures?", 
        choices: ["Metals", "Plastics", "Glass", "Wood", "Fabrics"], 
        correctAnswer: "Glass",
        image: "https://d1uvxqwmcz8fl1.cloudfront.net/tes/resources/11310181/ea0266e6-5cdd-4e93-be12-6e1f84f0b049/image?width=500&height=500&version=1663665026912"
    },
    { 
        question: "What material is used to make clothes?", 
        choices: ["Metals", "Plastics", "Glass", "Wood", "Fabrics"], 
        correctAnswer: "Fabrics",
        image: "https://d1uvxqwmcz8fl1.cloudfront.net/tes/resources/11310181/ea0266e6-5cdd-4e93-be12-6e1f84f0b049/image?width=500&height=500&version=1663665026912"
    },
    { 
        question: "The preserved remains or trace of a dead plant or animal from long ago is called?", 
        choices: ["Extinction", "An organism", "A fossil"], 
        correctAnswer: "A fossil",
        image: "https://media.istockphoto.com/id/1350952259/vector/illustration-of-cartoon-brontosaurus-dinosaur-fossil.jpg?s=612x612&w=0&k=20&c=aRBKEjSBGXYs_Sic3Ufm5LPsHkmlfTk5CSsinxMs92U="
    },
    { 
        question: "Fossils provide _____ for how living things & the environment have changed over time?", 
        choices: ["smells", "evidence", "dinosaurs", "food"], 
        correctAnswer: "evidence",
        image: "https://media.istockphoto.com/id/1360683145/vector/cartoon-dinosaurs-fossils-ancient-triceratops-dinosaur-skeleton-ammonite-and-leaf-fossil.jpg?s=612x612&w=0&k=20&c=4mDYmT_W4PfZu0Ndy8MRBgPG8zkGERmaKCTP4mAHrwE="
    },
    { 
        question: "What part of an animal is made into a fossil?", 
        choices: ["The skin", "The organs", "The skeleton"], 
        correctAnswer: "The skeleton",
        image: "https://img.freepik.com/free-vector/long-neck-dinosaur-standing-field_1308-31295.jpg"
    },
    { 
        question: "Name the soil made from sticky, small particles", 
        choices: ["Sandy soil", "Chalky soil", "Clay soil", "Peat"], 
        correctAnswer: "Clay soil",
        image: "https://simplelawnsolutions.com/cdn/shop/articles/unnamed_3ef171c0-50aa-455c-a18c-7bf1399debed.jpg?v=1653684140"
    },
    { 
        question: "What word is used for tiny animals, that do not have a backbone, like earthworms, millipedes & woodlice?", 
        choices: ["Minibeasts", "Mammals", "Reptiles", "Amphibians"], 
        correctAnswer: "Minibeasts",
        image: "https://www.northumberlandnationalpark.org.uk/wp-content/uploads/2020/05/Rough-Woodlouse-2.jpg"
    },
    { 
        question: "A rock which doesn't let water pass though it is called an _____ rock", 
        choices: ["Sedimentory", "Soft", "Permeable", "Impermeable"], 
        correctAnswer: "Impermeable",
        image: "https://aggregatesdirect.co.uk/wp-content/uploads/2021/02/Graphite-Grey-Slate-40mm-e1635960559766.jpg"
    },
    { 
        question: "What are solids, liquids and gases?", 
        choices: ["Different animals", "States of matter", "Tyes of processes", "Different forces"], 
        correctAnswer: "States of matter",
        image: "https://edcraft.io/wp-content/uploads/2021/08/solids-liquids-and-gases-for-kids.png"
    },
    { 
        question: "Which of the states of matter changes its shape & volume to fill the container it is in?", 
        choices: ["Solid", "Liquid", "Gas", "None"], 
        correctAnswer: "Gas",
        image: "https://t3.ftcdn.net/jpg/02/42/50/72/360_F_242507272_Pt6PpsbDIecxGboWx0GfIVsoMLT3sCf7.jpg"
    },
    { 
        question: "Which of the states of matter can be held?", 
        choices: ["Solid", "Liquid", "Gas", "None"], 
        correctAnswer: "Solid",
        image: "https://t3.ftcdn.net/jpg/02/42/50/72/360_F_242507272_Pt6PpsbDIecxGboWx0GfIVsoMLT3sCf7.jpg"
    },
    { 
        question: "Which of these is not a liquid?", 
        choices: ["Water", "Steam", "Milk", "Honey"], 
        correctAnswer: "Steam",
        image: "https://www.techexplorist.com/wp-content/uploads/2017/06/water-exists.jpg"
    },
    { 
        question: "Which state of matter is oxygen?", 
        choices: ["Solid", "Liquid", "Gas"], 
        correctAnswer: "Gas",
        image: "https://www.allinahealth.org/-/media/allina-health/content/healthy-set-go/benefits-of-deep-breathing.jpg"
    },
    { 
        question: "At what temperature does ice start to melt?", 
        choices: ["50°C", "100°C", "-1°C", "0°C"], 
        correctAnswer: "0°C",
        image: "https://www.popsci.com/uploads/2019/08/14/JCXUFYUOUHQ3OILJNXS3W5GJVE.jpg?auto=webp"
    },
    { 
        question: "Solids & liquids change from one state to another by heating or cooling.", 
        choices: ["False", "True"], 
        correctAnswer: "True",
        image: "https://keydifferences.com/wp-content/uploads/2016/10/solid-vs-liquid-gas.jpg"
    },
    { 
        question: "Chocolates melting point is _____ the melting point of ice.", 
        choices: ["less than", "higher than", "the same as"], 
        correctAnswer: "higher than",
        image: "https://www.themediterraneandish.com/wp-content/uploads/2022/12/hot-chocolate-recipe-FINAL-3.jpg"
    },
    { 
        question: "Freezing and melting are _____ changes.", 
        choices: ["lasting", "permanent", "irreversible", "reversible"], 
        correctAnswer: "reversible",
        image: "https://interintellect.com/wp-content/uploads/2021/08/ice-cube.jpeg"
    },
    { 
        question: "What happens a gas when it is cooled down?", 
        choices: ["It evaporates", "It condenses", "It freezes", "It melts"], 
        correctAnswer: "It condenses",
        image: "https://www.everest.co.uk/4a9dc8/globalassets/everest/windows/condensation-on-windows/condensation-top-banner-min.jpg"
    },
    { 
        question: "What happens a liquid when it is heated up?", 
        choices: ["It evaporates", "It condenses", "It freezes", "It melts"], 
        correctAnswer: "It evaporates",
        image: "https://images.newscientist.com/wp-content/uploads/2020/06/10165411/credit_mode-images_alamy_web.jpg"
    },
];

const scoreImages = {
    low: '/images/quiz_low.png',
    mid: '/images/quiz_mid.png',
    high: '/images/quiz_high.png'
};

let currentQuestionIndex = 0;
let chem_score = 0;

const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const scoreElement = document.getElementById('score');

function displayQuestion() {
    // Proceed with displaying the question and choices as before
    const currentQuestion = chemQuizQuestions[currentQuestionIndex];
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
    questionCount.textContent = `${currentQuestionIndex + 1}/${chemQuizQuestions.length}`;

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

function selectChoice(chosenAnswer) {
    //display feedback
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.style.display = 'block';

    if (chosenAnswer === chemQuizQuestions[currentQuestionIndex].correctAnswer) {
        chem_score++;
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
        if (button.textContent === chemQuizQuestions[currentQuestionIndex].correctAnswer) {
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
    if (currentQuestionIndex < chemQuizQuestions.length) {
        displayQuestion(); // Display the next question
    } else {
        displayScore(); // Or display the final score if it was the last question
    }
    this.style.display = 'none'; // Hide the Next button again
});

function displayScore() {
    const studentId = localStorage.getItem('studentId'); 
    questionElement.style.display = 'none';
    choicesElement.innerHTML = ''; 

    // Calculate score percentage
    const scorePercentage = (chem_score / chemQuizQuestions.length) * 100;

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
    scoreDisplay.textContent = `Your score: ${chem_score}/${chemQuizQuestions.length}`;
    scoreElement.appendChild(scoreDisplay);

    console.log('Chemistry score:', chem_score);

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
    sendScore(studentId, chem_score);
}

function retakeQuiz() {
    //reset quiz state
    currentQuestionIndex = 0;
    chem_score = 0;
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

function sendScore(studentId, chem_score) {
    console.log('Sending score to server:', { studentId, chem_score });
    fetch('/api/chemistry_scores', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentId: studentId, chem_score: chem_score})
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