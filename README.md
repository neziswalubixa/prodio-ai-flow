

# Workflow AI Assistant

AI-powered assistant that automates workplace tasks: email drafting, meeting summaries, and task planning using prompt engineering.

## Problem
Professionals spend hours on repetitive tasks like writing follow-up emails, summarizing meeting notes, and organizing tasks. This slows down productivity and delays client communication.

## Solution
Workflow AI Assistant uses prompt engineering to turn raw inputs into structured, usable outputs in seconds. Built as a responsive web app for easy use on desktop and mobile.

## Features
1. **Smart Email Generator**  
   Create professional emails in 3 tones: formal, friendly, persuasive. Includes subject line and copy button.

2. **Meeting Notes Summarizer**  
   Paste raw notes → get a concise summary, extracted decisions, and an action items table with owner, deadline, and status.

3. **AI Task Planner / Scheduler**  
   Input a list of tasks → get a prioritized daily or weekly schedule with priority badges and time estimates.

## Tech Stack
- React
- Tailwind CSS
- shadcn/ui components
- Mock AI responses for demo purposes

## How to Use
1. Open the app and select a feature from the sidebar.
2. Fill in the input fields with your raw data.
3. Click "Generate" to get the AI output.
4. Use the "Copy" button to copy results to your clipboard.

Note: This is a demo version using mock responses. No API key required.

## Responsible AI
AI-generated content may contain errors or bias. Always review outputs before sending to clients or stakeholders. Do not input sensitive or confidential information.

## Project Structure
workflow-ai-assistant/
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation for Email, Notes, Tasks
│   │   ├── Header.jsx           # App name, tagline, dark mode toggle
│   │   ├── EmailGenerator.jsx   # Input/output for email feature
│   │   ├── NotesSummarizer.jsx  # Input/output for notes feature  
│   │   ├── TaskPlanner.jsx      # Input/output for task planner
│   │   └── CopyButton.jsx       # Reusable copy-to-clipboard button
│   │
│   ├── lib/
│   │   ├── prompts.js           # The 3 prompt templates
│   │   └── mockData.js          # Example inputs/outputs for demo
│   │
│   ├── pages/
│   │   └── Dashboard.jsx        # Main page that switches between features
│   │
│   ├── App.jsx                  # Root component, handles routing/state
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind imports + global styles
│
├── .gitignore
├── package.json
├── README.md
└── vite.config.js               # If you used Vite with Lovable
