const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const statsStore = Object.create(null);
const statsFilePath = path.join(__dirname, 'stats.json');
const sessionsFilePath = path.join(__dirname, 'sessions.json');

function loadStatsFromFile() {
  try {
    if (fs.existsSync(statsFilePath)) {
      const raw = fs.readFileSync(statsFilePath, 'utf-8');
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        for (const [k, v] of Object.entries(data)) {
          statsStore[k] = {
            correct: Number(v.correct || 0),
            incorrect: Number(v.incorrect || 0),
            unanswered: Number(v.unanswered || 0),
          };
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load stats.json; starting with empty store.', err.message);
  }
}

function saveStatsToFile() {
  try {
    fs.writeFileSync(statsFilePath, JSON.stringify(statsStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to save stats.json:', err.message);
  }
}

function appendSessionToFile(session) {
  try {
    let arr = [];
    if (fs.existsSync(sessionsFilePath)) {
      const raw = fs.readFileSync(sessionsFilePath, 'utf-8');
      arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) arr = [];
    }
    arr.push(session);
    fs.writeFileSync(sessionsFilePath, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to append to sessions.json:', err.message);
  }
}
function addStat(questionId, key, inc = 1) {
  if (!statsStore[questionId]) statsStore[questionId] = { correct: 0, incorrect: 0, unanswered: 0 };
  statsStore[questionId][key] = (statsStore[questionId][key] || 0) + inc;
}

app.post('/api/submit-session', (req, res) => {
  try {
    const body = req.body || {};
    const nowIso = new Date().toISOString();
    const session = {
      answers: Array.isArray(body.answers) ? body.answers : [],
      score: Number(body.score || 0),
      totalQuestions: Number(body.totalQuestions || 0),
      startedAt: body.startedAt || nowIso,
      finishedAt: body.finishedAt || nowIso,
    };
    appendSessionToFile(session);
    return res.json({ ok: true });
  } catch (err) {
    console.error('submit-session error', err);
    return res.status(500).json({ ok: false, error: 'Failed to submit session' });
  }
});

app.get('/api/global-stats', (req, res) => {
  try {
    const hasAny = Object.keys(statsStore).length > 0;
    if (hasAny) return res.json({ stats: statsStore });

    let sessions = [];
    if (fs.existsSync(sessionsFilePath)) {
      const raw = fs.readFileSync(sessionsFilePath, 'utf-8');
      sessions = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(sessions)) sessions = [];
    }
    const agg = Object.create(null);
    for (const s of sessions) {
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
    return res.json({ stats: agg });
  } catch (err) {
    console.error('global-stats error', err);
    return res.status(500).json({ ok: false, error: 'Failed to fetch global stats' });
  }
});

app.get('/api/sessions', (req, res) => {
  try {
    let sessions = [];
    if (fs.existsSync(sessionsFilePath)) {
      const raw = fs.readFileSync(sessionsFilePath, 'utf-8');
      sessions = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(sessions)) sessions = [];
    }
    return res.json({ sessions });
  } catch (err) {
    console.error('sessions error', err);
    return res.status(500).json({ ok: false, error: 'Failed to fetch sessions' });
  }
});

app.post('/api/submit-answers', (req, res) => {
  try {
    const { answers } = req.body || {};
    if (!Array.isArray(answers)) {
      return res.status(400).json({ ok: false, error: 'answers must be an array' });
    }
    for (const a of answers) {
      if (a && typeof a.id === 'number') {
        if (a.answered) {
          addStat(a.id, a.correct ? 'correct' : 'incorrect', 1);
        } else {
          addStat(a.id, 'unanswered', 1);
        }
      }
    }
    saveStatsToFile();
    return res.json({ ok: true });
  } catch (err) {
    console.error('submit-answers error', err);
    return res.status(500).json({ ok: false, error: 'Failed to submit answers' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const idsParam = String(req.query.ids || '').trim();
    if (!idsParam) return res.json({});
    const ids = idsParam.split(',').map(s => Number(s)).filter(n => Number.isFinite(n));
    const out = {};
    for (const id of ids) {
      out[id] = statsStore[id] || { correct: 0, incorrect: 0, unanswered: 0 };
    }
    return res.json(out);
  } catch (err) {
    console.error('stats error', err);
    return res.status(500).json({ ok: false, error: 'Failed to fetch stats' });
  }
});


app.listen(PORT, () => {
  loadStatsFromFile();
  console.log(`Server running at http://localhost:${PORT}`);
});
