let currentQuestionIndex = 0;
let score = 0;
let incorrectQuestions = [];
let timerInterval;
let timeLeft = 0;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const resultElement = document.getElementById("result");
const incorrectAnswersDiv = document.getElementById("incorrect-answers");
const incorrectList = document.getElementById("incorrect-list");
const tryAgainButton = document.getElementById("try-again-button");
const timerElement = document.getElementById("timer");
const questionInput = document.getElementById("question-input");
const submitButton = document.getElementById("submit-questions");
const inputArea = document.getElementById("input-area");
const quizArea = document.getElementById("quiz-area");
const helpIcon = document.querySelector(".help-icon");
const helpContent = document.getElementById("help-content");
const copyTutorialButton = document.getElementById("copy-tutorial-button");

helpIcon.addEventListener("click", () => {
  helpContent.classList.toggle("hidden");
  helpContent.classList.toggle("expanded");
});

copyTutorialButton.addEventListener("click", () => {
  const helpContentText = helpContent.innerText;

  navigator.clipboard.writeText(helpContentText)
    .then(() => {
      copyTutorialButton.textContent = "Copied!";
      setTimeout(() => {
        copyTutorialButton.textContent = "Copy Tutorial";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateTimer() {
  timerElement.textContent = `Time: ${formatTime(timeLeft)}`;
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 0;
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

  currentQuestion.options.forEach((option) => {
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
    const buttonText = button.textContent.trim().toLowerCase();
    const correctAnswer = currentQuestion.correctAnswer.trim().toLowerCase();

    if (buttonText === correctAnswer) {
      button.style.backgroundColor = "lightgreen";
    } else {
      button.style.backgroundColor = "lightcoral";
    }
  });

  nextButton.style.display = "block";
}

function showResult() {
  clearInterval(timerInterval);

  questionElement.style.display = "none";
  optionsElement.style.display = "none";
  nextButton.style.display = "none";
  resultElement.style.display = "block";
  resultElement.textContent = `You got ${score} out of ${questions.length} questions right!`;

  if (incorrectQuestions.length > 0) {
    incorrectAnswersDiv.style.display = "block";
    incorrectList.innerHTML = "";
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

function tryAgain() {
  currentQuestionIndex = 0;
  score = 0;
  incorrectQuestions = [];
  incorrectAnswersDiv.style.display = "none";
  questionElement.style.display = "block";
  optionsElement.style.display = "block";
  nextButton.style.display = "block";
  resultElement.style.display = "none";
  resultElement.textContent = "";
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

function parseQuestions(text) {
  const questionBlocks = text.split("---").filter((block) => block.trim() !== "");
  const parsedQuestions = [];

  questionBlocks.forEach((block) => {
    const questionMatch = block.match(/Question: ([\s\S]*?)Choices:/);
    const choicesMatch = block.match(/Choices:([\s\S]*?)Correct Answer:/);
    const correctAnswerMatch = block.match(/Correct Answer: ([\s\S]*)/);

    if (questionMatch && choicesMatch && correctAnswerMatch) {
      const question = questionMatch[1].trim();
      const choicesText = choicesMatch[1].trim();
      const correctAnswer = correctAnswerMatch[1].trim();

      const options = choicesText
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const match = line.match(/\s*([A-D]\))/);
          if (match) {
            return line.trim();
          } else {
            return "";
          }
        })
        .filter((option) => option !== "");

      parsedQuestions.push({
        question: question,
        options: options,
        correctAnswer: correctAnswer,
      });
    } else {
      alert("Error: Invalid question format detected. Please follow the provided template.");
      return [];
    }
  });

  return parsedQuestions;
}

submitButton.addEventListener("click", () => {
  const inputText = questionInput.value;
  questions = parseQuestions(inputText);

  if (questions.length > 0) {
    inputArea.style.display = "none";
    quizArea.style.display = "block";
    loadQuestion();
    startTimer();
  } else {
    alert("Please enter questions in the correct format.");
  }
});