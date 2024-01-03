//header animations
let profile = document.querySelector('.header .flex .profile');

document.querySelector('#user-btn').onclick = () =>{
    profile.classList.toggle('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    profile.classList.remove('active');
    searchForm.classList.remove('active');
}

//quiz
// db connection
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'scimentor',
//     port: '3306'
// });

// db.connect((err)=> {
//     if(err) throw err;
// });
  
//   // Define an API endpoint to get questions
//   app.get('/api/questions', (req, res) => {
//     const query = 'SELECT * FROM questions';
  
//     pool.query(query, (error, results) => {
//       if (error) {
//         console.error('Error fetching questions:', error);
//         res.status(500).send('Internal Server Error');
//       } else {
//         res.json(results);
//       }
//     });
//   });

//   //server
//   app.listen(process.env.PORT || 3000);
//   console.log(" Server is listening on //localhost:3000/ ");

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