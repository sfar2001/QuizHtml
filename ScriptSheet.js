let scoresString = localStorage.getItem('scores');
let scores = scoresString ? JSON.parse(scoresString) : [];


class Option {
    constructor(text, isCorrect) {
        this.text = text;
        this.isCorrect = isCorrect;
    }
}

class Question {
    constructor(text, options) {
        this.text = text;
        this.options = options;
    }

    isAnswerCorrect(selectedOption) {
        return selectedOption.isCorrect;
    }
}

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    answerCurrentQuestion(selectedOption) {
        const currentQuestion = this.getCurrentQuestion();
        if (currentQuestion.isAnswerCorrect(selectedOption)) {
            this.score++;
            this.updateScoreDisplay();
        }
        this.currentQuestionIndex++;
    }

    updateScoreDisplay() {
        document.querySelector('.score').style.display = 'none';
        const scoreElement = document.querySelector('.score');
        scoreElement.textContent = `Score: ${this.score}`;
    }

    isFinished() {
        return this.currentQuestionIndex === this.questions.length;
    }

    getScore() {
        return this.score;
    }
}

async function fetchQuizData(apiKey) {
    const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=10`);
    const data = await response.json();
    return data;
}

function createQuestions(apiData) {
    return apiData.map(item => {
        const options = [];
        for (const [key, value] of Object.entries(item.answers)) {
            if (value !== null) {
                const isCorrect = item.correct_answers[`${key}_correct`] === "true";
                options.push(new Option(value, isCorrect));
            }
        }
        return new Question(item.question, options);
    });
}

async function initializeQuiz(apiKey) {
    const quizContext = { quiz: null };
    try {
        const data = await fetchQuizData(apiKey);
        const questions = createQuestions(data);
        quizContext.quiz = new Quiz(questions);
        renderQuestion(quizContext.quiz.getCurrentQuestion());
        quizContext.quiz.updateScoreDisplay();
        document.getElementById('next').addEventListener('click', () => {
            const selectedOption = getSelectedOption.call(quizContext);
            if (selectedOption) {
                quizContext.quiz.answerCurrentQuestion(selectedOption);
                if (quizContext.quiz.isFinished()) {
                    alert(`Congratulations! You have completed the quiz. Your final score is: ${quizContext.quiz.getScore()}.`);
                    document.getElementById('reset').style.display = 'flex';
                    document.querySelector('.score').style.display = 'flex';
                    let finalScore = quizContext.quiz.getScore();

                    scores.push(finalScore);

                    console.log(scores);
                    localStorage.setItem('scores', JSON.stringify(scores));


                } else {
                    renderQuestion(quizContext.quiz.getCurrentQuestion());
                }
            } else {
                alert('Please select an option.');
            }
        });

        document.getElementById('reset').addEventListener('click', () => {
            quizContext.quiz = null;
            initializeQuiz(apiKey);
            document.getElementById('reset').style.display = 'none';
        });
    } catch (error) {

        alert('An error occurred while loading the quiz. Please try again later.');
    }
}

function renderQuestion(question) {
    const questionElement = document.querySelector('.question .h5');
    questionElement.textContent = question.text;

    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';

    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.classList.add('options');
        label.textContent = option.text;

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'radio';

        const span = document.createElement('span');
        span.classList.add('checkmark');

        label.appendChild(input);
        label.appendChild(span);
        optionsElement.appendChild(label);
    });
}

function getSelectedOption() {
    const selectedRadio = document.querySelector('#options input[name="radio"]:checked');
    if (selectedRadio) {
        const selectedLabel = selectedRadio.parentElement;
        const selectedText = selectedLabel.textContent.trim();
        const selectedOption = getOptionByText.call(this, selectedText);
        return selectedOption;
    }
    return null;
}

function getOptionByText(text) {
    const currentQuestion = this.quiz.getCurrentQuestion();
    return currentQuestion.options.find(option => option.text === text);
}

const apiKey = 'tmXxHilqVbjDFzWJrDv6VIFicA7LDcgxI3Y2h2eQ';
initializeQuiz.call({ quiz: null }, apiKey);
function updateLeaderboard() {
    let scoresString = localStorage.getItem('scores');
    let scores = scoresString ? JSON.parse(scoresString) : [];
    let leaderboardItems = document.querySelectorAll('.body ol li');
    leaderboardItems.forEach((item, index) => {
        let nameElement = item.querySelector('mark');
        let scoreElement = item.querySelector('small');
        if (index < scores.length) {
            nameElement.textContent = `Quiz Number : ${index + 1}`;
            scoreElement.textContent = scores[index].toString();
        } else {
            item.style.display = 'none';
        }
    });
}
window.addEventListener('load', updateLeaderboard);
