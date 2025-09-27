const questions = [
    {
        question: "Which data structure uses LIFO (Last-In-First-Out) principle?",
        answers: [
            { text: "Queue", correct: false },
            { text: "Stack", correct: true },
            { text: "Heap", correct: false },
            { text: "Binary Search Tree", correct: false }
        ],
        topic: "Computer Science"
    },
    {
        question: "Which sorting algorithm has an average time complexity of O(n log n) and is in-place?",
        answers: [
            { text: "Merge Sort", correct: false },
            { text: "Quick Sort", correct: true },
            { text: "Selection Sort", correct: false },
            { text: "Bubble Sort", correct: false }
        ],
        topic: "Computer Science"
    },
    {
        question: "Who proposed the theory of general relativity?",
        answers: [
            { text: "Niels Bohr", correct: false },
            { text: "Albert Einstein", correct: true },
            { text: "Isaac Newton", correct: false },
            { text: "Max Planck", correct: false }
        ],
        topic: "Physics"
    },
    {
        question: "Which molecule carries genetic information in most living organisms?",
        answers: [
            { text: "RNA", correct: false },
            { text: "DNA", correct: true },
            { text: "ATP", correct: false },
            { text: "Glucose", correct: false }
        ],
        topic: "Biology"
    },
    {
        question: "Which empire built the road system known as the Royal Road?",
        answers: [
            { text: "Roman Empire", correct: false },
            { text: "Achaemenid (Persian) Empire", correct: true },
            { text: "Mongol Empire", correct: false },
            { text: "Ottoman Empire", correct: false }
        ],
        topic: "History"
    },
    {
        question: "Which novel begins with the line, 'Call me Ishmael.'?",
        answers: [
            { text: "Moby-Dick", correct: true },
            { text: "The Great Gatsby", correct: false },
            { text: "Crime and Punishment", correct: false },
            { text: "Pride and Prejudice", correct: false }
        ],
        topic: "Literature"
    },
    {
        question: "Which planet has the largest number of moons discovered so far?",
        answers: [
            { text: "Jupiter", correct: true },
            { text: "Saturn", correct: false },
            { text: "Uranus", correct: false },
            { text: "Neptune", correct: false }
        ],
        topic: "Astronomy"
    },
    {
        question: "Which protocol secures communication on the web by encrypting traffic?",
        answers: [
            { text: "HTTP", correct: false },
            { text: "TLS/SSL", correct: true },
            { text: "FTP", correct: false },
            { text: "SMTP", correct: false }
        ],
        topic: "Computer Networks"
    },
    {
        question: "Which country has the highest number of UNESCO World Heritage Sites?",
        answers: [
            { text: "China", correct: false },
            { text: "Italy", correct: true },
            { text: "India", correct: false },
            { text: "Spain", correct: false }
        ],
        topic: "Geography"
    },
    {
        question: "Which gas is primarily responsible for the greenhouse effect on Earth?",
        answers: [
            { text: "Oxygen", correct: false },
            { text: "Carbon dioxide", correct: true },
            { text: "Nitrogen", correct: false },
            { text: "Hydrogen", correct: false }
        ],
        topic: "Environment"
    },
    {
        question: "Which artist is associated with the painting 'The Persistence of Memory'?",
        answers: [
            { text: "Salvador Dalí", correct: true },
            { text: "Henri Matisse", correct: false },
            { text: "Edvard Munch", correct: false },
            { text: "Jackson Pollock", correct: false }
        ],
        topic: "Art"
    },
    {
        question: "In databases, which normal form eliminates partial dependencies on a composite key?",
        answers: [
            { text: "1NF", correct: false },
            { text: "2NF", correct: true },
            { text: "3NF", correct: false },
            { text: "BCNF", correct: false }
        ],
        topic: "Databases"
    },
    {
        question: "Which mathematician introduced the concept of a function and formalized analysis with 'epsilon-delta'?",
        answers: [
            { text: "Leonhard Euler", correct: false },
            { text: "Augustin-Louis Cauchy", correct: true },
            { text: "Carl Friedrich Gauss", correct: false },
            { text: "Bernhard Riemann", correct: false }
        ],
        topic: "Mathematics"
    },
    {
        question: "Which city hosted the first modern Olympic Games in 1896?",
        answers: [
            { text: "Paris", correct: false },
            { text: "Athens", correct: true },
            { text: "London", correct: false },
            { text: "Rome", correct: false }
        ],
        topic: "Sports History"
    },
    {
        question: "What does the 'ACID' property in databases stand for?",
        answers: [
            { text: "Atomicity, Consistency, Isolation, Durability", correct: true },
            { text: "Accuracy, Consistency, Integrity, Durability", correct: false },
            { text: "Atomicity, Concurrency, Isolation, Durability", correct: false },
            { text: "Accuracy, Concurrency, Integrity, Durability", correct: false }
        ],
        topic: "Databases"
    },
    {
        question: "Which programming paradigm emphasizes functions and immutability?",
        answers: [
            { text: "Object-Oriented Programming", correct: false },
            { text: "Functional Programming", correct: true },
            { text: "Procedural Programming", correct: false },
            { text: "Logic Programming", correct: false }
        ],
        topic: "Computer Science"
    },
    {
        question: "Which country was formerly known as Siam?",
        answers: [
            { text: "Myanmar", correct: false },
            { text: "Thailand", correct: true },
            { text: "Cambodia", correct: false },
            { text: "Laos", correct: false }
        ],
        topic: "World History"
    },
    {
        question: "Which layer of the OSI model is responsible for routing packets between networks?",
        answers: [
            { text: "Data Link Layer", correct: false },
            { text: "Network Layer", correct: true },
            { text: "Transport Layer", correct: false },
            { text: "Session Layer", correct: false }
        ],
        topic: "Computer Networks"
    },
    {
        question: "Which chemical element has the highest electrical conductivity at standard conditions?",
        answers: [
            { text: "Gold", correct: false },
            { text: "Silver", correct: true },
            { text: "Copper", correct: false },
            { text: "Aluminum", correct: false }
        ],
        topic: "Chemistry"
    },
    {
        question: "Which philosopher wrote 'The Republic'?",
        answers: [
            { text: "Aristotle", correct: false },
            { text: "Plato", correct: true },
            { text: "Socrates", correct: false },
            { text: "Descartes", correct: false }
        ],
        topic: "Philosophy"
    },
    {
        question: "Which operating system introduced the " +
                 "concept of a monolithic kernel widely adopted in Unix-like systems?",
        answers: [
            { text: "Windows NT", correct: false },
            { text: "Linux", correct: true },
            { text: "MS-DOS", correct: false },
            { text: "Mac OS (Classic)", correct: false }
        ],
        topic: "Operating Systems"
    },
    {
        question: "Who was the first Mughal emperor of India?",
        answers: [
            { text: "Akbar", correct: false },
            { text: "Babur", correct: true },
            { text: "Humayun", correct: false },
            { text: "Aurangzeb", correct: false }
        ],
        topic: "Indian History"
    },
    {
        question: "Who led the Dandi March (Salt March) in 1930?",
        answers: [
            { text: "Subhas Chandra Bose", correct: false },
            { text: "Mahatma Gandhi", correct: true },
            { text: "Jawaharlal Nehru", correct: false },
            { text: "Sardar Patel", correct: false }
        ],
        topic: "Indian History"
    },
    {
        question: "In which year did the Constitution of India come into effect?",
        answers: [
            { text: "1947", correct: false },
            { text: "1950", correct: true },
            { text: "1952", correct: false },
            { text: "1949", correct: false }
        ],
        topic: "Indian Polity"
    },
    {
        question: "What is the lower house of the Indian Parliament called?",
        answers: [
            { text: "Rajya Sabha", correct: false },
            { text: "Lok Sabha", correct: true },
            { text: "Vidhan Sabha", correct: false },
            { text: "Gram Sabha", correct: false }
        ],
        topic: "Democracy"
    },
    {
        question: "Which Article of the Indian Constitution guarantees the Right to Equality?",
        answers: [
            { text: "Article 21", correct: false },
            { text: "Article 14", correct: true },
            { text: "Article 19", correct: false },
            { text: "Article 32", correct: false }
        ],
        topic: "Indian Polity"
    },
    {
        question: "Who was the Chairman of the Drafting Committee of the Indian Constitution?",
        answers: [
            { text: "Dr. Rajendra Prasad", correct: false },
            { text: "B. R. Ambedkar", correct: true },
            { text: "Jawaharlal Nehru", correct: false },
            { text: "Sardar Vallabhbhai Patel", correct: false }
        ],
        topic: "Indian Polity"
    },
    {
        question: "The Battle of Plassey was fought in which year?",
        answers: [
            { text: "1764", correct: false },
            { text: "1757", correct: true },
            { text: "1857", correct: false },
            { text: "1707", correct: false }
        ],
        topic: "Indian History"
    },
    {
        question: "What was the capital of the Maurya Empire?",
        answers: [
            { text: "Taxila", correct: false },
            { text: "Pataliputra", correct: true },
            { text: "Ujjain", correct: false },
            { text: "Kannauj", correct: false }
        ],
        topic: "Indian History"
    },
    {
        question: "Which body is responsible for conducting elections in India?",
        answers: [
            { text: "Parliament of India", correct: false },
            { text: "Election Commission of India", correct: true },
            { text: "Supreme Court of India", correct: false },
            { text: "Comptroller and Auditor General", correct: false }
        ],
        topic: "Democracy"
    },
    {
        question: "Fundamental Duties are enshrined in which part of the Indian Constitution?",
        answers: [
            { text: "Part IV (Directive Principles)", correct: false },
            { text: "Part IV-A", correct: true },
            { text: "Part III (Fundamental Rights)", correct: false },
            { text: "Part V", correct: false }
        ],
        topic: "Indian Polity"
    }
];

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const scoreElement = document.getElementById("score");
const totalQuestionsElement = document.getElementById("total-questions");
const restartButton = document.getElementById("restart-btn");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-btn");
const chartsContainer = document.getElementById("charts-container");
const timerElement = document.createElement("div"); // Create a new element for the timer
timerElement.id = "timer"; // Assign an ID for styling and manipulation
quizContainer.prepend(timerElement); // Add timer to the quiz container

// Analysis/email UI removed

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10; // Time in seconds for each question
let timerId;
let shuffledQuestions; // Subset of questions with original indices
let answeredThisQuestion = false;
let userAnswerLog = []; // {id, answered, correct, topic}
let sessionStartISO = null;
// Analysis removed: no topic breakdown or AI state

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswerLog = [];
    sessionStartISO = new Date().toISOString();
    // Create a shuffled copy with original index as id
    const indexed = questions.map((q, idx) => ({ ...q, id: idx }));
    shuffledQuestions = indexed.sort(() => Math.random() - 0.5).slice(0, 10);
    totalQuestionsElement.innerHTML = shuffledQuestions.length; // Update total questions display
    // Persist the set of displayed question IDs for Global Stats filtering
    try {
        localStorage.setItem('last_displayed_question_ids', JSON.stringify(shuffledQuestions.map(q => q.id)));
    } catch (e) { /* no-op */ }
    startScreen.classList.add("hide");
    resultContainer.classList.add("hide");
    quizContainer.classList.remove("hide");
    nextButton.innerHTML = "Next";
    showQuestion();
    startTimer(); // Start the timer when the quiz begins
}

function startTimer() {
    clearInterval(timerId); // Clear any existing timer
    timeLeft = 10; // Reset time for each question
    timerElement.innerHTML = `Time Left: ${timeLeft}s`;
    timerId = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            // If time runs out and no answer selected, record as unanswered/incorrect
            if (!answeredThisQuestion) {
                const q = shuffledQuestions[currentQuestionIndex];
                userAnswerLog.push({ id: q.id, answered: false, correct: false, topic: q.topic });
            }
            handleNextButton(); // Move to next question if time runs out
        }
    }, 1000);
}

function showQuestion() {
    resetState();
    startTimer(); // Start timer for each new question
    answeredThisQuestion = false;
    let currentQuestion = shuffledQuestions[currentQuestionIndex]; // Use shuffledQuestions
    questionElement.innerHTML = (currentQuestionIndex + 1) + ". " + currentQuestion.question;

    // Shuffle options for the current question
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
    clearInterval(timerId); // Stop the timer when an answer is selected
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

    // Submit answers to backend (no charts here per requirement)
    try {
        await postJSON('/api/submit-answers', { answers: userAnswerLog });
    } catch (err) {
        console.warn('Failed to submit answers to backend:', err?.message || err);
    }

    // Also persist the full session (best-effort)
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

    // Save to localStorage for offline/global fallback
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
    // Go back to start screen
    resultContainer.classList.add("hide");
    startScreen.classList.remove("hide");
});

startButton.addEventListener("click", startQuiz);

// Networking helpers and chart rendering
async function postJSON(url, data) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function renderCharts(statsById) {
    chartsContainer.innerHTML = '';
    shuffledQuestions.forEach((q, idx) => {
        const stats = statsById[q.id] || { correct: 0, incorrect: 0, unanswered: 0 };
        const answeredEntry = userAnswerLog.find(a => a.id === q.id);
        const answeredText = answeredEntry?.answered ? (answeredEntry.correct ? 'Answered: Correct' : 'Answered: Incorrect') : 'Not Answered';

        // Percentages EXCLUDE unanswered, per request
        const totalAnswered = (stats.correct || 0) + (stats.incorrect || 0);
        const correctPct = totalAnswered > 0 ? Math.round((stats.correct / totalAnswered) * 100) : 0;
        const incorrectPct = totalAnswered > 0 ? Math.round((stats.incorrect / totalAnswered) * 100) : 0;

        const card = document.createElement('div');
        card.className = 'chart-card';
        card.innerHTML = `
            <div class="chart-header">
                <div class="q-index">Q${idx + 1}</div>
                <div class="q-text">${q.question}</div>
            </div>
            <div class="q-meta">
                <span class="status">${answeredText}</span>
                <span class="pct">Correct: ${correctPct}% • Incorrect: ${incorrectPct}%</span>
            </div>
            <div class="charts-row">
                <div class="chart-box">
                    <canvas id="pie-q${q.id}"></canvas>
                </div>
                <div class="chart-box">
                    <canvas id="bar-q${q.id}"></canvas>
                </div>
            </div>
        `;
        chartsContainer.appendChild(card);

        // Pie chart (Correct vs Incorrect) - based on answered only
        const pieCtx = document.getElementById(`pie-q${q.id}`);
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [{
                    data: [stats.correct || 0, stats.incorrect || 0],
                    backgroundColor: ['#22c55e', '#ef4444']
                }]
            },
            options: {
                plugins: { legend: { position: 'bottom' } }
            }
        });

        // Bar chart (Histogram): Correct, Incorrect, Unanswered
        const barCtx = document.getElementById(`bar-q${q.id}`);
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Correct', 'Incorrect', 'Unanswered'],
                datasets: [{
                    label: 'Responses',
                    data: [stats.correct || 0, stats.incorrect || 0, stats.unanswered || 0],
                    backgroundColor: ['#22c55e', '#ef4444', '#6b7280']
                }]
            },
            options: {
                scales: { y: { beginAtZero: true, ticks: { precision:0 } } },
                plugins: { legend: { display: false } }
            }
        });
    });
}
