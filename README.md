# Quiz Website with AI Analysis and Email Reports

A modern quiz app with a glassmorphism UI, local background image, AI-enhanced (or heuristic) analysis, and email delivery of the report.

## Features

- **Local background image** sourced from `Quiz.png`.
- **Timed quiz** with randomized questions from `script.js`.
- **Topic-wise analysis** generated on the client.
- **AI-enhanced analysis** from the server using OpenAI if `OPENAI_API_KEY` is provided, otherwise a smart **heuristic fallback**.
- **Email reports** sent via SMTP using your email provider settings.

## Project Structure

- `index.html` — Frontend UI.
- `style.css` — Styling (uses `Quiz.png` as background).
- `script.js` — Quiz logic, analysis rendering, requests to backend.
- `server.js` — Express server, AI analysis endpoint, email endpoint, static file serving.
- `package.json` — Node project metadata and dependencies.
- `.env.example` — Example environment configuration.

## Prerequisites

- Node.js 18+
- An SMTP account to send emails (e.g., Gmail App Password, SendGrid, Mailgun, etc.)
- Optional: OpenAI API key for AI analysis.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env`** by copying the example:
   ```bash
   cp .env.example .env
   ```
   Then fill in the values:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`
   - Optional: `OPENAI_API_KEY` and `OPENAI_MODEL`

   Notes for Gmail:
   - Enable 2FA on your Google account
   - Create an App Password for "Mail"
   - Use host `smtp.gmail.com`, port `587`, `SMTP_SECURE=false`, and the App Password as `SMTP_PASS`

3. **Run the app**
   ```bash
   npm start
   ```
   Open http://localhost:3000 in your browser.

## How it Works

- The client computes topic-wise scores and shows them in the `#analysis-report` section.
- When you reach the report, the client calls `POST /api/analyze` with `{ topicScores, score, totalQuestions }`.
  - If `OPENAI_API_KEY` is set, the server returns an AI-written summary.
  - Otherwise, the server returns a heuristic, readable summary.
- When you click "Send Report", the client calls `POST /api/send-report` with your email and the computed report. The server sends the email via your SMTP settings.

## Customization

- Edit questions in `script.js` (`questions` array).
- Style via `style.css`. The background uses `Quiz.png` in the project root.
- Tune analysis prompts or model in `server.js`.

## Troubleshooting

- If emails are not sending, verify SMTP credentials and that your provider allows SMTP.
- If AI analysis fails, check `OPENAI_API_KEY` and internet connectivity; you will still get a heuristic summary.
- If the background image does not show, ensure `Quiz.png` is present in the same directory and the filename matches case.

## Security

- Do not commit real credentials. Use `.env` for secrets.
- This demo server is not rate-limited or authenticated; do not deploy as-is to production.
