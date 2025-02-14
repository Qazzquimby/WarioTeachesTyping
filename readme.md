Warioware game with only text interface
Online. No server. Firebase db to hold questions and microgames.
User provides openrouter api key.
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


# auth

consider something like

import { AuthorizationServer, generateCodeVerifier, generateCodeChallenge } from 'oauth4webapi';

const server: AuthorizationServer = {
  issuer: 'https://openrouter.ai',
  authorization_endpoint: 'https://openrouter.ai/auth',
  token_endpoint: 'https://openrouter.ai/api/v1/auth/keys',
};

export async function login() {
  const codeVerifier = await generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const callbackUrl = encodeURIComponent(window.location.origin);

  // Store in sessionStorage instead of localStorage for slightly better security
  sessionStorage.setItem('code_verifier', codeVerifier);

  const authUrl = `${server.authorization_endpoint}?callback_url=${callbackUrl}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  window.location.href = authUrl;
}
