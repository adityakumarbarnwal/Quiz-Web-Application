/* global Chart */
(async function init() {
  const chartsContainer = document.getElementById('global-charts');

  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  async function fetchJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }

  try {
    const [questions, correctAnswers] = await Promise.all([
      fetchJSON('questions.json'),
      fetchJSON('correct_answers.json').catch(() => [])
    ]);
    const qTextById = new Map(questions.map(q => [q.id, q.question]));
    const correctById = new Map((Array.isArray(correctAnswers) ? correctAnswers : []).map(a => [a.id, a.answer]));

    // 1) Try server aggregates
    let statsById = null;
    try {
      const globalRes = await fetchJSON('/api/global-stats');
      statsById = globalRes?.stats || null;
    } catch (_) { /* no-op */ }

    // 2) If missing or empty, try computing from server sessions
    if (!statsById || Object.keys(statsById).length === 0) {
      try {
        const sessionsRes = await fetchJSON('/api/sessions');
        const sessions = Array.isArray(sessionsRes?.sessions) ? sessionsRes.sessions : [];
        statsById = aggregateFromSessions(sessions);
      } catch (_) { /* no-op */ }
    }

    // 3) If still missing, use localStorage
    if (!statsById || Object.keys(statsById).length === 0) {
      try {
        const raw = localStorage.getItem('quiz_sessions_local');
        const sessions = raw ? JSON.parse(raw) : [];
        statsById = aggregateFromSessions(sessions);
      } catch (_) { /* no-op */ }
    }

    chartsContainer.innerHTML = '';

    // Load current user's most recent local session (for per-question status)
    let lastLocalSession = null;
    try {
      const raw = localStorage.getItem('quiz_sessions_local');
      const sessions = raw ? JSON.parse(raw) : [];
      if (Array.isArray(sessions) && sessions.length > 0) {
        lastLocalSession = sessions[sessions.length - 1];
      }
    } catch (_) { /* ignore */ }

    // Determine which questions to show
    let allIds = questions.map(q => q.id);
    try {
      const rawIds = localStorage.getItem('last_displayed_question_ids');
      const lastIds = rawIds ? JSON.parse(rawIds) : null;
      if (Array.isArray(lastIds) && lastIds.length > 0) {
        const set = new Set(lastIds);
        allIds = allIds.filter(id => set.has(id));
      }
    } catch (_) { /* use all questions */ }
    // Register datalabels plugin if available
    try { Chart.register(window.ChartDataLabels || ChartDataLabels); } catch (_) {}

    allIds.forEach((id, idx) => {
      const stats = (statsById && statsById[id]) || { correct: 0, incorrect: 0, unanswered: 0 };
      const qText = qTextById.get(id) || `Question ${id}`;

      const totalAnswered = (stats.correct || 0) + (stats.incorrect || 0);
      const correctPct = totalAnswered > 0 ? Math.round((stats.correct / totalAnswered) * 100) : 0;
      const incorrectPct = totalAnswered > 0 ? Math.round((stats.incorrect / totalAnswered) * 100) : 0;

      // Current user's status for this question
      let userStatus = 'Unattempted';
      if (lastLocalSession && Array.isArray(lastLocalSession.answers)) {
        const a = lastLocalSession.answers.find(x => x && x.id === id);
        if (a) {
          if (!a.answered) userStatus = 'Unattempted';
          else userStatus = a.correct ? 'Correct' : 'Incorrect';
        }
      }

      const card = el('div', 'chart-card');
      const correctAnsText = correctById.get(id) || '';
      card.innerHTML = `
        <div class="chart-header">
          <div class="q-index">Q${idx + 1}</div>
          <div class="q-text">${qText}</div>
        </div>
        <div class="q-meta">
          <span class="pct">Correct: ${correctPct}% • Incorrect: ${incorrectPct}%</span>
          <span class="status">You: ${userStatus}</span>
        </div>
        ${correctAnsText ? `<div class="q-meta"><span class="status"><strong>Correct answer:</strong> ${correctAnsText}</span></div>` : ''}
        <div class="charts-row">
          <div class="chart-box"><canvas id="g-pie-${id}"></canvas></div>
        </div>
      `;
      chartsContainer.appendChild(card);

      const pieCtx = document.getElementById(`g-pie-${id}`);
      new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Correct', 'Incorrect'],
          datasets: [{ data: [stats.correct || 0, stats.incorrect || 0], backgroundColor: ['#22c55e', '#ef4444'] }]
        },
        options: {
          plugins: {
            legend: { position: 'bottom' },
            datalabels: {
              color: '#fff',
              font: { weight: '600' },
              formatter: (value, ctx) => {
                const ds = ctx.chart.data.datasets[0].data;
                const total = ds.reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((value / total) * 100);
                return pct + '%';
              }
            }
          }
        }
      });
    });
  } catch (err) {
    console.error('Failed to load global stats', err);
    chartsContainer.innerHTML = '<p class="error">Could not load global stats. Try again later.</p>';
  }
  function aggregateFromSessions(sessions) {
    const agg = Object.create(null);
    for (const s of (Array.isArray(sessions) ? sessions : [])) {
      const answers = Array.isArray(s?.answers) ? s.answers : [];
      for (const a of answers) {
        if (typeof a?.id !== 'number') continue;
        if (!agg[a.id]) agg[a.id] = { correct: 0, incorrect: 0, unanswered: 0 };
        if (a.answered) {
          if (a.correct) agg[a.id].correct += 1; else agg[a.id].incorrect += 1;
        } else {
          agg[a.id].unanswered += 1;
        }
      }
    }
    return agg;
  }
})();
