let currentQuestionIndex = 0;
let userAnswers = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
};

let questions = [];
const startPage = document.querySelector('.start-page');
const questionSection = document.querySelector('.question');
const progressSection = document.querySelector('.progress-bar');
const optionsSection = document.querySelector('.options');
const resultSection = document.querySelector('.result');

function startTest() {
    startPage.style.display = 'none';
    questionSection.style.display = 'block';
    progressSection.style.display = 'block';
    optionsSection.style.display = 'block';

    const participantCountElement = document.getElementById('participantCount');
    participantCountElement.textContent = parseInt(participantCountElement.textContent) + 1;

    currentQuestionIndex = 0;
    userAnswers = {
        E: 0,
        I: 0,
        S: 0,
        N: 0,
        T: 0,
        F: 0,
        J: 0,
        P: 0,
    };

    fetchQuestions();
}

function fetchQuestions() {
    fetch('https://my-json-server.typicode.com/DDF-KOREA/mbti-cat/questions')
        .then((response) => response.json())
        .then((data) => {
            questions = data;
            updateQuestion();
            updateProgressBar();
        })
        .catch((error) => console.error('Error fetching questions:', error));
}

function nextQuestion(answer) {
    userAnswers[answer]++;
    userAnswers[getOppositeType(answer)] = Math.max(userAnswers[getOppositeType(answer)] - 1, 0);

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestion();
        updateProgressBar();
    } else {
        showResult();
    }
}

function getOppositeType(type) {
    return type === 'E' ? 'I' : type === 'I' ? 'E' : type === 'S' ? 'N' : type === 'N' ? 'S' : type === 'T' ? 'F' : type === 'F' ? 'T' : type === 'J' ? 'P' : type === 'P' ? 'J' : '';
}

function updateQuestion() {
    const questionElement = document.getElementById('questionText');
    const currentQuestion = questions && questions[currentQuestionIndex];

    if (questionElement && currentQuestion) {
        questionElement.textContent = currentQuestion.text;
        const optionsContainer = document.querySelector('.options');
        optionsContainer.innerHTML = '';

        currentQuestion.answers.forEach((answer) => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.setAttribute('value', answer.value);
            button.addEventListener('click', () => nextQuestion(answer.value));
            optionsContainer.appendChild(button);
        });
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');

    if (progressFill) {
        const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = percent + '%';
    }
}

function showResult() {
    const mainElement = document.querySelector('.result');
    mainElement.style.display = 'block';
    questionSection.style.display = 'none';
    progressSection.style.display = 'none';
    optionsSection.style.display = 'none';

    mainElement.innerHTML = '';

    const resultImage = document.createElement('img');
    resultImage.classList.add('result-image');
    const finalResult = getFinalResult();
    const imageUrl = `https://ddf-korea-test.s3.ap-northeast-2.amazonaws.com/image/${finalResult}.jpg`;

    resultImage.onload = function () {
        mainElement.prepend(resultImage);
    };

    resultImage.src = imageUrl;

    const returnButton = document.createElement('button');
    returnButton.classList.add('return-button');
    returnButton.textContent = '시작 페이지로 돌아가기';
    returnButton.onclick = returnToStart;
    mainElement.appendChild(returnButton);
}

function getFinalResult() {
    const accumulatedAnswers = Object.entries(userAnswers)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]);

    const EI = accumulatedAnswers.filter((type) => type === 'E' || type === 'I')[0];
    const NS = accumulatedAnswers.filter((type) => type === 'N' || type === 'S')[0];
    const FT = accumulatedAnswers.filter((type) => type === 'F' || type === 'T')[0];
    const JP = accumulatedAnswers.filter((type) => type === 'J' || type === 'P')[0];

    const finalResult = `${EI}${NS}${FT}${JP}`;
    // console.log(finalResult);

    return finalResult;
}

function returnToStart() {
    if (resultSection) {
        resultSection.style.display = 'none';
    }

    if (questionSection) {
        questionSection.style.display = 'none';
    }

    if (progressSection) {
        progressSection.style.display = 'none';
    }

    if (optionsSection) {
        optionsSection.style.display = 'none';
    }

    if (startPage) {
        startPage.style.display = 'block';
    }

    currentQuestionIndex = 0;
    userAnswers = {
        E: 0,
        I: 0,
        S: 0,
        N: 0,
        T: 0,
        F: 0,
        J: 0,
        P: 0,
    };

    updateQuestion();
    updateProgressBar();
}

window.onload = () => {
    const startPage = document.querySelector('.start-page');
    startPage.style.display = 'block';
};