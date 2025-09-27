require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from this directory
app.use(express.static(path.join(__dirname)));

// Optional OpenAI client (for analysis only; email reporting removed)
let openaiClient = null;
try {
  const OpenAI = require('openai');
  if (process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (err) {
  // openai dependency is present in package.json; this try/catch prevents crash if import changes
}

// In-memory store for aggregated per-question statistics
// Structure: { [questionId:number]: { correct:number, incorrect:number, unanswered:number } }
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

function heuristicAnalysis({ topicScores, score, totalQuestions }) {
  const lines = [];
  const overallPct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  lines.push(`Overall: ${score}/${totalQuestions} (${overallPct}%).`);

  const strengths = [];
  const improvements = [];
  for (const topic of Object.keys(topicScores || {})) {
    const { correct = 0, incorrect = 0 } = topicScores[topic] || {};
    const total = correct + incorrect;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const summary = `${topic}: ${correct}/${total} (${pct}%).`;
    lines.push(summary);
    if (pct >= 75) strengths.push(topic);
    else if (pct < 50) improvements.push(topic);
  }

  if (strengths.length) {
    lines.push(`Strengths: ${strengths.join(', ')}.`);
  }
  if (improvements.length) {
    lines.push(`Needs Improvement: ${improvements.join(', ')}.`);
  }
  lines.push('Tips: Focus more on topics listed under Needs Improvement. Revisit fundamentals and practice timed questions.');

  return lines.join('\n');
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { topicScores, score, totalQuestions, answers, questions } = req.body || {};

    // If OpenAI is configured, generate a narrative analysis
    if (openaiClient) {
      const content = `You are a tutor. Given a quiz result, produce a concise, encouraging analysis with bullet points.\n\nOverall score: ${score}/${totalQuestions}.\nTopic breakdown (correct/total):\n${Object.entries(topicScores || {})
        .map(([t, v]) => `${t}: ${(v.correct || 0)}/${(v.correct || 0) + (v.incorrect || 0)}`)
        .join('\n')}\n\nIf provided, you may reference mistakes to suggest what to study next. Keep it under 150 words.`;

      const response = await openaiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert learning coach.' },
          { role: 'user', content }
        ],
        temperature: 0.7,
      });
      const aiText = response.choices?.[0]?.message?.content?.trim() || '';
      return res.json({ ok: true, aiText });
    }

    // Fallback heuristic analysis if no OpenAI API key
    const aiText = heuristicAnalysis({ topicScores, score, totalQuestions });
    return res.json({ ok: true, aiText, fallback: true });
  } catch (err) {
    console.error('Analyze error', err);
    return res.status(500).json({ ok: false, error: 'Failed to analyze results' });
  }
});

// Persist a full quiz session
// Body: { answers: [...], score: number, totalQuestions: number, startedAt?: string, finishedAt?: string }
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

// Global stats for all questions currently known (from statsStore)
app.get('/api/global-stats', (req, res) => {
  try {
    // If in-memory stats are populated, return them
    const hasAny = Object.keys(statsStore).length > 0;
    if (hasAny) return res.json({ stats: statsStore });

    // Otherwise, compute aggregates from sessions.json as a fallback
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

// Raw sessions for client fallback analytics
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

// Accepts: { answers: [{ id:number, answered:boolean, correct:boolean }] }
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
    // Persist after update
    saveStatsToFile();
    return res.json({ ok: true });
  } catch (err) {
    console.error('submit-answers error', err);
    return res.status(500).json({ ok: false, error: 'Failed to submit answers' });
  }
});

// Returns stats for a list of question IDs
// GET /api/stats?ids=1,2,3
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
