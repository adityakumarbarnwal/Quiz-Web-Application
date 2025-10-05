async function loadQuestionsFromJSON() {
    try {
        const res = await fetch('questions.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
            const hasFull = typeof json[0] === 'object' && json[0] && Array.isArray(json[0].answers);
            if (hasFull) {
                questions = json;
                return;
            }
            const byId = new Map(questions.map((q, idx) => [q.id ?? idx, { ...q, id: q.id ?? idx }]));
            const merged = [];
            for (const item of json) {
                if (item && typeof item.id === 'number') {
                    const base = byId.get(item.id);
                    if (base) {
                        merged.push({ ...base, id: item.id, question: item.question || base.question });
                    }
                }
            }
            if (merged.length > 0) questions = merged;
        }
    } catch (_) {
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestionsFromJSON();
    updateLevelSelectionUI();
});

let questions = [];

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const scoreElement = document.getElementById("score");
const totalQuestionsElement = document.getElementById("total-questions");
const restartButton = document.getElementById("restart-btn");
const startScreen = document.getElementById("start-screen");
const schoolButton = document.getElementById("school-btn");
const collegeButton = document.getElementById("college-btn");
const proButton = document.getElementById("pro-btn");
const startBtn = document.getElementById("start-btn");
const levelSelectedEl = document.getElementById("level-selected");
const timerElement = document.createElement("div");
timerElement.id = "timer";
quizContainer.prepend(timerElement);

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timerId;
let shuffledQuestions;
let selectedLevel = null;
let answeredThisQuestion = false;
let userAnswerLog = [];
let sessionStartISO = null;

function startQuiz(level) {
    currentQuestionIndex = 0;
    score = 0;
    userAnswerLog = [];
    sessionStartISO = new Date().toISOString();
    selectedLevel = level || null;
    try { localStorage.setItem('selected_level', selectedLevel || ''); } catch (_) {}

    const indexed = questions.map((q, idx) => ({ ...q, id: (typeof q.id === 'number') ? q.id : idx }));

    if (selectedLevel) {
        const primary = indexed.filter(q => q.level === selectedLevel);
        if (primary.length < 10) {
            try {
                window.alert(`Only ${primary.length} question(s) available for the selected level. The quiz will proceed with these.`);
            } catch (_) {}
        }
        shuffledQuestions = primary.sort(() => Math.random() - 0.5).slice(0, 10);
    } else {
        shuffledQuestions = indexed.sort(() => Math.random() - 0.5).slice(0, 10);
    }
    totalQuestionsElement.innerHTML = shuffledQuestions.length; // Update total questions display
    try {
        localStorage.setItem('last_displayed_question_ids', JSON.stringify(shuffledQuestions.map(q => q.id)));
        localStorage.setItem('last_displayed_questions', JSON.stringify(shuffledQuestions.map(q => ({ id: q.id, question: q.question }))));
        const corrects = shuffledQuestions.map(q => {
            const c = (q.answers || []).find(a => a && a.correct);
            return { id: q.id, answer: c ? c.text : '' };
        });
        localStorage.setItem('last_displayed_correct_answers', JSON.stringify(corrects));
    } catch (e) { /* no-op */ }
    startScreen.classList.add("hide");
    resultContainer.classList.add("hide");
    quizContainer.classList.remove("hide");
    nextButton.innerHTML = "Next";
    showQuestion();
    startTimer();
}

function startTimer() {
    clearInterval(timerId);
    timeLeft = 10;
    timerElement.innerHTML = `Time Left: ${timeLeft}s`;
    timerId = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            if (!answeredThisQuestion) {
                const q = shuffledQuestions[currentQuestionIndex];
                userAnswerLog.push({ id: q.id, answered: false, correct: false, topic: q.topic });
            }
            handleNextButton();
        }
    }, 1000);
}

function showQuestion() {
    resetState();
    startTimer();
    answeredThisQuestion = false;
    let currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.innerHTML = (currentQuestionIndex + 1) + ". " + currentQuestion.question;

    const options = [...currentQuestion.answers].sort(() => Math.random() - 0.5);
    options.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add("hide");
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    clearInterval(timerId);
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    answeredThisQuestion = true;
    const q = shuffledQuestions[currentQuestionIndex];
    userAnswerLog.push({ id: q.id, answered: true, correct: !!isCorrect, topic: q.topic });
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.classList.remove("hide");
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

async function showResult() {
    quizContainer.classList.add("hide");
    resultContainer.classList.remove("hide");
    scoreElement.innerHTML = score;
    totalQuestionsElement.innerHTML = shuffledQuestions.length;

    try {
        await postJSON('/api/submit-answers', { answers: userAnswerLog });
    } catch (err) {
        console.warn('Failed to submit answers to backend:', err?.message || err);
    }

    try {
        await postJSON('/api/submit-session', {
            answers: userAnswerLog,
            score,
            totalQuestions: shuffledQuestions.length,
            startedAt: sessionStartISO,
            finishedAt: new Date().toISOString(),
        });
    } catch (e) {
        console.warn('Failed to persist session:', e?.message || e);
    }

    try {
        const key = 'quiz_sessions_local';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push({ answers: userAnswerLog, score, totalQuestions: shuffledQuestions.length, startedAt: sessionStartISO, finishedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
        console.warn('Failed to save session to localStorage:', e?.message || e);
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < shuffledQuestions.length) {
        handleNextButton();
    }
});

restartButton.addEventListener("click", () => {
    resultContainer.classList.add("hide");
    startScreen.classList.remove("hide");
    selectedLevel = null;
    try { localStorage.removeItem('selected_level'); } catch (_) {}
    updateLevelSelectionUI();
});

function updateLevelSelectionUI() {
  const btns = [schoolButton, collegeButton, proButton];
  const levels = ['school','college','professional'];
  btns.forEach((b, i) => {
    if (!b) return;
    const isActive = selectedLevel === levels[i];
    b.classList.toggle('active', !!isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  if (levelSelectedEl) {
    let label = 'None';
    if (selectedLevel === 'school') label = 'School';
    else if (selectedLevel === 'college') label = 'College';
    else if (selectedLevel === 'professional') label = 'Professional';
    levelSelectedEl.textContent = `Selected level: ${label}`;
  }
}

function setLevel(level) {
  selectedLevel = level;
  try { localStorage.setItem('selected_level', selectedLevel || ''); } catch (_) {}
  updateLevelSelectionUI();
}

// Levels
if (schoolButton) schoolButton.addEventListener("click", () => setLevel('school'));
if (collegeButton) collegeButton.addEventListener("click", () => setLevel('college'));
if (proButton) proButton.addEventListener("click", () => setLevel('professional'));

if (startBtn) startBtn.addEventListener("click", () => {
  const lvl = (selectedLevel && selectedLevel.length) ? selectedLevel : null;
  if (!lvl) {
    const proceedMixed = window.confirm('You have not selected a level.\n\nClick OK to proceed with a mixed set of questions (School + College + Professional).\nClick Cancel to choose a level first.');
    if (proceedMixed) return startQuiz(null);
    window.alert('Please choose a level (School, College, or Professional) to proceed.');
    return;
  }
  startQuiz(lvl);
});

selectedLevel = null;
try { localStorage.removeItem('selected_level'); } catch (_) {}
updateLevelSelectionUI();

async function postJSON(url, data) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

