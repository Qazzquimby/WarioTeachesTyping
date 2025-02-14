Warioware game with only text interface
Online. No server. Firebase db to hold questions and microgames.
Doesn't need to be responsive to a mobile view since it relies on fast keyboard typing.

# Style

No redundant comments. Only comment when its otherwise unclear why the line was written.
Careful naming conventions.

# UI

Current prompt
Current time remaining for prompt
Lives remaining
Large textbox
Round i / 10


Please add <link rel="stylesheet" href="https://unpkg.com/98.css@0.1.4/build/98.css" />

# Questions

Microgame
A type of question. A question generator.

- list of previous questions
- A js generator function to make new questions. Has access to promptLLM(prompt) if needed. Runs in browser environment
  - Might take a difficulty score 0-2 param
    We manually write MicroGames, and let the generator make individual Questions over time.

Question
A single specific question.

- Prompt for user
- Hint provided on failure
- Description of what constitutes a valid answer (for llm grading)
- List of previously accepted answers

# LLM use
Can be temporarily mocked
Should use netlify functions later to protect openrouter api key
