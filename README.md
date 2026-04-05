# BrainSpark - Daily Learning App for Kids

A fun, colorful 10-minute daily learning app designed for 6-year-olds. Built with Next.js and deployed on Vercel.

## What's Inside

Five daily activities that keep kids engaged:

| Activity | Duration | Description |
|----------|----------|-------------|
| Quiz Time | 2 min | 10 multiple-choice questions (Math, English, Science, GK) |
| New Words | 2 min | 10 vocabulary flashcards with pronunciation and examples |
| Memory Game | 3 min | 4x4 card matching game with animations |
| Video Time | 2 min | Curated educational YouTube video |
| Brain Challenge | 1 min | IQ/logic questions + review of today's learning |

## Features

- **250+ starter questions** across Math, English, Science, General Knowledge, and IQ/Logic
- **100 vocabulary words** with pronunciation guides and example sentences
- **30 curated YouTube videos** from SciShow Kids, National Geographic Kids, Numberblocks, etc.
- **OpenAI integration** for generating fresh content over time (optional)
- **Streak tracking** to encourage daily learning habits
- **Sound effects** generated via Web Audio API (no audio files needed)
- **Kid-friendly UI** with animations, pastel colors, and encouraging feedback

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** with custom animations
- **OpenAI SDK** (gpt-4o-mini) for content generation
- **localStorage** for progress tracking

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up OpenAI key (optional)

Create or edit `.env.local`:

```
OPENAI_API_KEY=sk-your-key-here
```

The app works fully without an API key using the built-in question bank. The key enables fresh question/word generation over time.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy on Vercel

### Quick Setup

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**
3. Import your GitHub repository
4. **Add environment variable**: `OPENAI_API_KEY` = your OpenAI API key
5. Click **Deploy**

### Where to Add the OpenAI Key in Vercel

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** (top nav)
3. Click **Environment Variables** (left sidebar)
4. Add:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: your OpenAI API key
   - **Environment**: select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** for the change to take effect (Deployments tab > three dots > Redeploy)

### Auto-Deploy on Git Push

Vercel auto-deploys by default when connected to GitHub:

- **Push to `main`** = production deployment
- **Push to any branch** = preview deployment
- **Open a PR** = preview deployment with a unique URL

No CI/CD configuration needed. Every `git push` triggers a new deploy automatically.

## Project Structure

```
src/
  app/              # Pages (dashboard, quiz, words, game, video, review, summary)
  components/       # UI components (QuizQuestion, WordCard, MemoryBoard, etc.)
  context/          # Session state management
  data/             # Starter content (questions, words, videos as JSON)
  hooks/            # Custom hooks (useSound)
  lib/              # Utilities (content selection, scoring, OpenAI prompts)
  types/            # TypeScript interfaces
```

## Content

| Category | Count | Source |
|----------|-------|--------|
| Math questions | 50 | Built-in |
| English questions | 50 | Built-in |
| Science questions | 50 | Built-in |
| GK questions | 50 | Built-in |
| IQ/Logic questions | 50 | Built-in |
| Vocabulary words | 100 | Built-in |
| YouTube videos | 30 | Curated |
| Generated content | Unlimited | OpenAI (optional) |
