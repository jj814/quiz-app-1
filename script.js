const QUESTIONS = [
  {
    text: "What is the full meaning of HTML?",
    options: [
      "Hypertext Markup Language",
      "Happy Map Lang",
      "Hypertext 092arkup Language",
      "Hyperpyker Markup Language",
    ],
    answerIndex: 0,
  },
  {
    text: "Why do we use code?",
    options: [
      "To make websites",
      "To make books",
      "To make pencils",
      "To make cards",
    ],
    answerIndex: 0,
  },
  {
    text: "Who are we talking to when we code?",
    options: ["The computer", "The air", "Ourselves", "Dogs"],
    answerIndex: 0,
  },
  {
    text: "Which tag is used for the largest heading in HTML?",
    options: ["<h6>", "<head>", "<h1>", "<title>"],
    answerIndex: 2,
  },
  {
    text: "Which attribute is used to provide alternative text for an image in HTML?",
    options: ["src", "href", "alt", "title"],
    answerIndex: 2,
  },
];

let current = 0;
let score = 0;
let selectedIndex = null;
let locked = false;

const paginationEl = document.getElementById("pagination");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const quizEl = document.getElementById("quiz");

function updatePagination() {
  paginationEl.textContent = `Question ${current + 1}/${QUESTIONS.length}`;
}

function renderQuestion() {
  const q = QUESTIONS[current];
  questionEl.textContent = q.text;
  optionsEl.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const li = document.createElement("li");
    li.className = "option";
    li.setAttribute("role", "option");
    li.setAttribute("tabindex", "0");
    li.dataset.index = idx;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.id = `opt-${current}-${idx}`;
    input.value = idx;

    const label = document.createElement("label");
    label.setAttribute("for", input.id);
    label.textContent = opt;

    li.appendChild(input);
    li.appendChild(label);

    const select = () => {
      if (locked) return;
      selectedIndex = idx;
      updateSelectedVisual();
      nextBtn.disabled = false;
    };

    li.addEventListener("click", select);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    });

    optionsEl.appendChild(li);
  });

  selectedIndex = null;
  locked = false;
  nextBtn.disabled = true;
  updatePagination();
}

function updateSelectedVisual() {
  [...optionsEl.children].forEach((li) => {
    li.classList.remove("selected");
    const idx = Number(li.dataset.index);
    const input = li.querySelector("input[type='radio']");
    input.checked = idx === selectedIndex;
    if (idx === selectedIndex) li.classList.add("selected");
  });
}

function revealAnswer() {
  const q = QUESTIONS[current];
  locked = true;

  [...optionsEl.children].forEach((li) => {
    const idx = Number(li.dataset.index);
    li.classList.remove("selected");
    if (idx === q.answerIndex) {
      li.classList.add("correct");
    } else if (idx === selectedIndex) {
      li.classList.add("incorrect");
    }
  });
}

function showResult() {
  quizEl.classList.add("hidden");
  resultEl.classList.remove("hidden");

  const percent = Math.round((score / QUESTIONS.length) * 100);

  resultEl.innerHTML = `
      <h2>All done 🎉</h2>
      <div class="score">You scored ${score} / ${QUESTIONS.length} (${percent}%)</div>
      <div class="summary">
        Keep practicing to improve your score.
      </div>
      <div class="buttons">
        <button id="restart" class="btn">Restart</button>
      </div>
    `;

  document.getElementById("restart").addEventListener("click", () => {
    current = 0;
    score = 0;
    selectedIndex = null;
    locked = false;
    resultEl.classList.add("hidden");
    quizEl.classList.remove("hidden");
    renderQuestion();
  });
}

nextBtn.addEventListener("click", () => {
  if (selectedIndex === null && !locked) return;

  if (!locked) {
    revealAnswer();
    if (selectedIndex === QUESTIONS[current].answerIndex) score++;

    nextBtn.textContent =
      current + 1 === QUESTIONS.length ? "See result" : "Continue";
    return;
  }

  current++;
  if (current < QUESTIONS.length) {
    nextBtn.textContent = "Next";
    renderQuestion();
  } else {
    showResult();
  }
});

renderQuestion();

