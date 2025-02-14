<script setup lang="ts">
import { onMounted } from 'vue'
import { AuthorizationServer, generateRandomCodeVerifier, calculatePKCECodeChallenge } from 'oauth4webapi'
import { state } from '~/state'

const server: AuthorizationServer = {
  issuer: 'https://openrouter.ai',
  authorization_endpoint: 'https://openrouter.ai/auth',
  token_endpoint: 'https://openrouter.ai/api/v1/auth/keys',
}

const errorMessage = ref('')
const isHandlingCallback = ref(false)

async function login() {
  const codeVerifier = generateRandomCodeVerifier()
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier)
  const callbackUrl = encodeURIComponent(window.location.origin)

  sessionStorage.setItem('code_verifier', codeVerifier)
  window.location.href = `${server.authorization_endpoint}?callback_url=${callbackUrl}&code_challenge=${codeChallenge}&code_challenge_method=S256`
}

async function handleCallback() {
  isHandlingCallback.value = true
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (!code) {
    errorMessage.value = 'Missing authorization code'
    return
  }

  try {
    const codeVerifier = sessionStorage.getItem('code_verifier')
    const response = await fetch(server.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code'
      })
    })

    if (!response.ok) throw new Error('Token exchange failed')

    const { api_key } = await response.json()
    state.userAPIKey = api_key
    localStorage.setItem('openrouter-key', api_key)
    window.history.replaceState({}, document.title, window.location.pathname)
  } catch (error) {
    errorMessage.value = 'Failed to authenticate. Please try again.'
  } finally {
    isHandlingCallback.value = false
  }
}

onMounted(() => {
  if (window.location.search.includes('code=')) {
    handleCallback()
  }
})
</script>

<template>
  <div v-if="!state.userAPIKey" class="fixed inset-0 flex items-center justify-center bg-black/80">
    <div class="rounded bg-white p-8 text-center">
      <button
        class="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
        @click="login"
      >
        Login with OpenRouter
      </button>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>

      <div v-if="isHandlingCallback" class="mt-4 text-gray-600">
        Authenticating...
      </div>
    </div>
  </div>
</template>
