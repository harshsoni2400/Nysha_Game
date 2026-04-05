# BrainSpark - Daily Learning App for Kids

A fun, colorful 10-minute daily learning app designed for 6-year-olds. Built with Next.js and deployed on Vercel.

## What's Inside

Six daily activities that keep kids engaged:

| Activity | Duration | Description |
|----------|----------|-------------|
| Quiz Time | 2 min | 10 multiple-choice questions (Math, English, Science, GK) |
| New Words | 2 min | 10 vocabulary flashcards with pronunciation and examples |
| Memory Game | 3 min | 4x4 card matching game with animations |
| Video Time | 2 min | Curated educational YouTube video |
| Fun Facts | 2 min | 5 amazing facts about animals, places, flags, or space |
| Brain Challenge | 2 min | 10 IQ/logic questions + review of today's learning |

## Features

- **1,000 questions** across Math, English, Science, General Knowledge, and IQ/Logic (200 per subject)
- **200 vocabulary words** with pronunciation guides and example sentences
- **60 fun fact topics** covering animals, world places, flags, and space
- **30 curated YouTube videos** from SciShow Kids, National Geographic Kids, Numberblocks, etc.
- **No API keys needed** - all content is built-in, works fully offline
- **Streak tracking** to encourage daily learning habits
- **Sound effects** generated via Web Audio API (no audio files needed)
- **Kid-friendly UI** with animations, pastel colors, and encouraging feedback

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** with custom animations
- **localStorage** for progress tracking
- **Zero external dependencies** for content

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**
3. Import your GitHub repository
4. Set **Framework Preset** to **Next.js**
5. Click **Deploy**

No environment variables or API keys needed.

### Auto-Deploy on Git Push

Vercel auto-deploys by default when connected to GitHub:

- **Push to `main`** = production deployment
- **Push to any branch** = preview deployment
- **Open a PR** = preview deployment with a unique URL

No CI/CD configuration needed. Every `git push` triggers a new deploy automatically.

## Project Structure

```
src/
  app/              # Pages (dashboard, quiz, words, game, video, funfacts, review, summary)
  components/       # UI components (QuizQuestion, WordCard, MemoryBoard, etc.)
  context/          # Session state management
  data/             # All content (questions, words, videos, fun facts as JSON)
  hooks/            # Custom hooks (useSound)
  lib/              # Utilities (content selection, scoring)
  types/            # TypeScript interfaces
```

## Content

| Category | Count |
|----------|-------|
| Math questions | 200 |
| English questions | 200 |
| Science questions | 200 |
| GK questions | 200 |
| IQ/Logic questions | 200 |
| Vocabulary words | 200 |
| Fun fact topics | 60 |
| YouTube videos | 30 |

With 1,000 questions and daily rotation, content won't repeat for months.
