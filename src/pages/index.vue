<script setup lang="ts">
import {state, startNewRound, resetGame as resetGameState} from '~/state'
import {useTimer} from '~/state'
import { onMounted, onUnmounted, ref } from 'vue'

const timer = ref<number>()
const {timeLeft} = useTimer()

const showFeedback = ref(false)
const feedbackMessage = ref('')
const feedbackTimeout = ref<number>()
const isCorrect = ref(false)

// Unified loss handler
function handleLoss() {
  console.log("lose")
  state.lives = Math.max(0, state.lives - 1)
  state.currentRound++

  if (state.lives > 0) {
    startNewRound()
  } else {
    state.gameOver = true
    state.score = state.currentRound - 1
    if (timer.value) clearInterval(timer.value)
  }
}

// Timer logic
function startTimer(initialTime?: number) {
  if (timer.value) clearInterval(timer.value)
  const timeLimit = state.activeQuestion?.timeLimit || 10
  timeLeft.value = initialTime ?? timeLimit

  timer.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer.value)
      submitAnswer()
    }
  }, 1000)
}

async function submitAnswer() {
  if (!state.activeQuestion) return

  clearTimeout(feedbackTimeout.value)
  const submission = state.inputText.trim()
  const correct = state.activeQuestion.acceptedAnswers[0]

  const remainingTime = timeLeft.value
  if (timer.value) clearInterval(timer.value)

  if (state.activeQuestion.validateLocally(submission)) {
    isCorrect.value = true
    console.log("win")
    state.currentRound++
    state.score = state.currentRound - 1

    feedbackMessage.value = `Nice.`
    showFeedback.value = true
    feedbackTimeout.value = window.setTimeout(() => {
      showFeedback.value = false
      startTimer(remainingTime)
      startRound()
    }, 1000)
  } else {
    isCorrect.value = false
    feedbackMessage.value = `You entered: ${submission}\nCorrect answer: ${correct}`

    showFeedback.value = true
    feedbackTimeout.value = window.setTimeout(() => {
      showFeedback.value = false
      startTimer(remainingTime)
      handleLoss()
    }, 2000)
  }
}

const timeLeftPercent = computed(() => {
  const timeLimit = state.activeQuestion?.timeLimit || 10
  return 100 * (timeLeft.value / timeLimit)
})

// Update round starter
async function startRound() {
  await startNewRound()
  startTimer()
}

// Lifecycle hooks
onMounted(startRound)
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})

async function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    await submitAnswer()
  } else if (e.key === 'Escape') {
    startRound()
  }
}

onMounted(startRound)

async function resetGame() {
  if (timer.value) clearInterval(timer.value)
  resetGameState()
  await startRound()
}
</script>

<template>
  <div v-if="!state.gameOver" class="window" style="width: 600px"
       :class="{ 'feedback-correct': isCorrect && showFeedback,
                 'feedback-incorrect': !isCorrect && showFeedback }">
    <div class="title-bar">
      <div class="title-bar-text">Type This!</div>
    </div>
    <div class="window-body">
      <div class="mb-4 text-2xl">
        {{ state.activeQuestion?.prompt }}
      </div>
      <textarea class="text-xl w-full p-2"
                v-model="state.inputText"
                rows="3"
                autofocus
                @keydown="handleKeydown"
      />

      <div class="status-bar-field">Time Left: {{ timeLeft }}
        <div class="progress-indicator segmented">
          <span
            class="progress-indicator-bar"
            :style="{ width: `${timeLeftPercent}%` }"
            :class="{ warning: timeLeftPercent < 30, danger: timeLeftPercent < 10 }"
          />
        </div>
      </div>

    </div>
  </div>

  <div v-else class="window" style="width: 400px">
    <div class="title-bar">
      <div class="title-bar-text">Game Over</div>
    </div>
    <div class="window-body text-center">
      <h2 class="text-xl mb-4">Game Over!</h2>
      <p class="mb-4">Final Score: {{ state.score }}</p>
      <button
        class="px-4 py-2 border hover:bg-gray-100 active:bg-gray-200"
        @click="resetGame"
      >
        Play Again
      </button>
    </div>
  </div>

  <div v-if="showFeedback && !isCorrect" class="error-modal window">
    <div class="title-bar bg-red-500">
      <div class="title-bar-text" style="font-size: 16px">⚠️ Incorrect!</div>
    </div>
    <div class="window-body whitespace-pre-line text-lg">
      {{ feedbackMessage }}
      <div class="text-center mt-4 text-base">
        Closing in 2 seconds...
      </div>
    </div>
  </div>
</template>
