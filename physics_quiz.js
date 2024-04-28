const phyQuizQuestions = [
    { 
        question: "A planet is a _____.", 
        choices: ["big rock in space,", "celestial body that orbits a star", "ball of fire", "star"], 
        correctAnswer: "celestial body that orbits a star",
        image: "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/3156018/planet-clipart-md.png"
    },
    { 
        question: "How long does it take the earth to make one complete spin on its axis?", 
        choices: ["1 month", "365 days", "24 hours", "60 minutes"], 
        correctAnswer: "24 hours",
        image: "https://img.freepik.com/free-vector/spinning-globe-isolated-vector_1308-115407.jpg"
    },
    { 
        question: "Which planet is closest to the sun?", 
        choices: ["Venus", "Mercury", "Jupiter", "Neptune"], 
        correctAnswer: "Mercury",
        image: "https://media.istockphoto.com/id/525563143/vector/planets-of-the-solar-system.jpg?s=612x612&w=0&k=20&c=t_pHqwgzPNo5D9a8mR8KAlQoMRSUNL5krVIu7aLy4WY="
    },
    { 
        question: "Which of these spherical bodies is a star?", 
        choices: ["The Moon", "Earth", "The Sun", "Mars"], 
        correctAnswer: "The Sun",
        image: "https://media.istockphoto.com/id/1083271022/vector/the-model-of-the-solar-system.jpg?s=612x612&w=0&k=20&c=iRvBRJK7fwrIB9XJvCr3AZTDN_NMvFAiZ6gkJbPaNCY="
    },
    { 
        question: "The different shapes of the moon are called?", 
        choices: ["Outlines", "Periods", "Triangles", "Phases"], 
        correctAnswer: "Phases",
        image: "https://i.pinimg.com/originals/fc/3d/f4/fc3df4c1ac1b0318ce687d1ec6794efc.png"
    },
    { 
        question: "What is a light source?", 
        choices: ["Something that absorbs light", "Something that reflects light", "Something that produces light"], 
        correctAnswer: "Something that produces light",
        image: "https://img.freepik.com/free-vector/blue-table-lamp-sticker-white-background_1308-62930.jpg?size=626&ext=jpg&ga=GA1.1.1788068356.1708905600&semt=ais"
    },
    { 
        question: "Which of these is a source of light?", 
        choices: ["The Sun", "The Moon", "The Earth"], 
        correctAnswer: "The Sun",
        image: "https://letstalkscience.ca/sites/default/files/2023-01/moon%20orbit%20tilt.png"
    },
    { 
        question: "Which if these is NOT a light source?", 
        choices: ["Light bulb", "Tree", "Firefly"], 
        correctAnswer: "Tree",
        image: "https://www.thelightbulb.co.uk/wp-content/uploads/2016/05/halogen-guide-3.jpg"
    },
    { 
        question: "Which of these facts about light is TRUE?", 
        choices: ["It is slow", "It travels in straight lines", "It bends around corners"], 
        correctAnswer: "It travels in straight lines",
        image: "https://cdn.mos.cms.futurecdn.net/b32yP4hScsApPYBAEU33NC-1200-80.jpg"
    },
    { 
        question: "When there is no light, we say it is _____.", 
        choices: ["sunny", "dark", "light"], 
        correctAnswer: "dark",
        image: "https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2018/06/Nighttime-photography-02.jpg?fit=1500%2C1061&ssl=1"
    },
    { 
        question: "What happens when both the north poles of two magnets are brought together?", 
        choices: ["They repel each other", "They attract each other", "They do nothing"], 
        correctAnswer: "They repel each other",
        image: "https://images.theconversation.com/files/232831/original/file-20180821-30602-yybzcy.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=754&fit=clip"
    },
    { 
        question: "Which of these items do NOT use a magnet?", 
        choices: ["Compass", "Pedal bike", "Fridge freezer"], 
        correctAnswer: "Pedal bike",
        image: "https://www.stanfordmagnets.com/wp-content/uploads/2020/06/How_Magnets_Work-2-1.png"
    },
    { 
        question: "What is the pitch of a sound?", 
        choices: ["How loud a sound is", "How quiet a sound is", "The distance of a sound", "How high or low a sound is"], 
        correctAnswer: "How high or low a sound is",
        image: "https://musiccrashcourses.com/images/other/soundwave.png"
    },
    { 
        question: "The rumble of a lorry produces a _____-pitched sound.", 
        choices: ["quiet", "long", "high", "low"], 
        correctAnswer: "low",
        image: "https://www.returnloads.net/getattachment/Blog/Becoming-a-Lorry-Driver/how-to-be-a-lorry-driver.jpg"
    },
    { 
        question: "Which of these is likely to make a high-pitched sound?", 
        choices: ["Thunder", "Gong", "Fireworks", "Cow"], 
        correctAnswer: "Fireworks",
        image: "https://i.pinimg.com/474x/a8/0b/f9/a80bf9f958f926a160067488787a42d6--high-pitch-oval-windows.jpg"
    },
    { 
        question: "How do we get mains electricity in our homes?", 
        choices: ["From plug sockets", "From taps", "From WI-FI", "Through the letterbox"], 
        correctAnswer: "From plug sockets",
        image: "https://africa-energy-portal.org/sites/default/files/2019-06/electricity-connection.jpg"
    },
    { 
        question: "Electricity is made by gas, coal, oil wind or solar-panelled _____.", 
        choices: ["Accelerators", "Generations", "Generators", "Batteries"], 
        correctAnswer: "Generators",
        image: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL0hvdy10by1idWlsZC1hbi1lbGVjdHJpYy1nZW5lcmF0b3IuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9fX0="
    },
    { 
        question: "Which kind of natural material lets electricity flow through it?", 
        choices: ["Conductor", "Insulator", "Connector"], 
        correctAnswer: "Conductor",
        image: "https://ichef.bbci.co.uk/images/ic/1200xn/p09xcqxw.jpg"
    },
    { 
        question: "Which object is an electrical insulator?", 
        choices: ["Copper wires", "Metal paperclips", "Plastic bottle"], 
        correctAnswer: "Plastic bottle",
        image: "https://www.thoughtco.com/thmb/R_m9RLLKKFepIv5ca9a1iHM0JJU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/examples-of-electrical-conductors-and-insulators-608315_v3-5b609152c9e77c004f6e8892.png"
    },
    { 
        question: "In a circuit with a switch, battery & bulb, what would happen if the switch in the circuit was opened?", 
        choices: ["The bulb would change colour", "The bulb would not light up", "The bulb would be dull", "The bulb would light up"], 
        correctAnswer: "The bulb would not light up",
        image: "https://www.teachengineering.org/content/cub_/lessons/cub_images/cub_electricity_lesson05_figure1.jpg"
    },
];

const scoreImages = {
    low: '/images/quiz_low.png',
    mid: '/images/quiz_mid.png',
    high: '/images/quiz_high.png'
};

let currentQuestionIndex = 0;
let phy_score = 0;

const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const scoreElement = document.getElementById('score');

// display question function
function displayQuestion() {
    // Proceed with displaying the question and choices as before
    const currentQuestion = phyQuizQuestions[currentQuestionIndex];
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
    questionCount.textContent = `${currentQuestionIndex + 1}/${phyQuizQuestions.length}`;

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

    if (chosenAnswer === phyQuizQuestions[currentQuestionIndex].correctAnswer) {
        phy_score++;
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
        if (button.textContent === phyQuizQuestions[currentQuestionIndex].correctAnswer) {
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
    if (currentQuestionIndex < phyQuizQuestions.length) {
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
    const scorePercentage = (phy_score / phyQuizQuestions.length) * 100;

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
    scoreDisplay.textContent = `Your score: ${phy_score}/${phyQuizQuestions.length}`;
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
    sendScore(studentId, phy_score);
}

// retake quiz function
function retakeQuiz() {
    //reset quiz state
    currentQuestionIndex = 0;
    phy_score = 0;
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
function sendScore(studentId, phy_score) {
    fetch('/api/physics_scores', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentId: studentId, phy_score: phy_score})
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