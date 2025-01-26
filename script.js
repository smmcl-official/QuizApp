let currentQuestionIndex = 0;
let score = 0;
let incorrectQuestions = [];
let timerInterval;
let timeLeft = 0; // Set initial time in seconds

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const resultElement = document.getElementById("result");
const incorrectAnswersDiv = document.getElementById("incorrect-answers");
const incorrectList = document.getElementById("incorrect-list");
const tryAgainButton = document.getElementById("try-again-button");
const timerElement = document.getElementById("timer");

// Function to shuffle array (Fisher-Yates Shuffle Algorithm)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

// Function to update timer display
function updateTimer() {
  timerElement.textContent = `Time: ${formatTime(timeLeft)}`;
}

// Function to start timer
function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  timeLeft = 0; // Reset time to 0
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft++;
    updateTimer();
  }, 1000);
}

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;

  optionsElement.innerHTML = "";

  // Shuffle options for the current question
  const shuffledOptions = [...currentQuestion.options];
  shuffle(shuffledOptions);

  shuffledOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");
    button.addEventListener("click", () => {
      checkAnswer(option);
      showCorrectAnswer();
    });
    optionsElement.appendChild(button);
  });

  nextButton.style.display = "none";
}

function checkAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === currentQuestion.correctAnswer) {
    score++;
  } else {
    incorrectQuestions.push({
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correctAnswer,
      selectedAnswer: selectedOption,
    });
  }

  const optionButtons = document.querySelectorAll(".option");
  optionButtons.forEach((button) => {
    button.disabled = true;
  });
}

function showCorrectAnswer() {
  const currentQuestion = questions[currentQuestionIndex];
  const optionButtons = document.querySelectorAll(".option");
  optionButtons.forEach((button) => {
    if (button.textContent === currentQuestion.correctAnswer) {
      button.style.backgroundColor = "lightgreen";
    } else {
      button.style.backgroundColor = "lightcoral";
    }
  });

  nextButton.style.display = "block";
}

function showResult() {
  clearInterval(timerInterval); // Stop the timer

  questionElement.style.display = "none";
  optionsElement.style.display = "none";
  nextButton.style.display = "none";
  resultElement.textContent = `You got ${score} out of ${questions.length} questions right!`;

  if (incorrectQuestions.length > 0) {
    incorrectAnswersDiv.style.display = "block";
    incorrectList.innerHTML = ""; // Clear previous list
    incorrectQuestions.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <p><strong>Question:</strong> ${item.question}</p>
        <p><strong>Correct Answer:</strong> ${item.correctAnswer}</p>
        <p><strong>Your Answer:</strong> ${item.selectedAnswer}</p>
      `;
      incorrectList.appendChild(li);
    });
  }
}

// Reset the quiz and start again
function tryAgain() {
  currentQuestionIndex = 0;
  score = 0;
  incorrectQuestions = [];
  incorrectAnswersDiv.style.display = "none";
  questionElement.style.display = "block";
  optionsElement.style.display = "block";
  nextButton.style.display = "block";
  resultElement.textContent = "";
  shuffle(questions);
  loadQuestion();
  startTimer();
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

tryAgainButton.addEventListener("click", tryAgain);

// Fetch questions from JSON file
let questions = [];
fetch("css.json")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
    shuffle(questions);
    loadQuestion();
    startTimer();
  })
  .catch((error) => {
    console.error("Error fetching or parsing JSON:", error);
    questionElement.textContent = "Error loading questions.";
  });