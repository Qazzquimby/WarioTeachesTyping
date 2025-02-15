<script setup lang="ts">
import {state, startNewRound} from '~/state'
import {useTimer} from '~/state'
import { onMounted, onUnmounted, ref } from 'vue'

const timer = ref<number>()
const {timeLeft} = useTimer()

// Unified loss handler
function handleLoss() {
  console.log("lose")
  state.lives = Math.max(0, state.lives - 1)
  state.currentRound++
  if (state.lives > 0) {
    startNewRound()
  } else {
    console.log("GAME OVER")
    // Handle game over state
  }
}

// Timer logic
function startTimer() {
  if (timer.value) clearInterval(timer.value)
  const timeLimit = state.activeQuestion?.timeLimit || 10
  timeLeft.value = timeLimit
  
  timer.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      handleLoss()
    }
  }, 1000)
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
  if (e.key === 'Enter' && !e.shiftKey && state.inputText && state.activeQuestion) {
    e.preventDefault()

    const validLocal = state.activeQuestion.validateLocally(
      state.inputText.trim().toUpperCase()
    )
    // const validLLM = validLocal || await validateWithLLM(state.activeQuestion, state.inputText)
    if (validLocal) {
      console.log("win")
      state.currentRound++
      startRound()
    } else {
      handleLoss()
    }
  } else if (e.key === 'Escape') {
    startRound()
  }
}

onMounted(startRound)
</script>

<template>
  <div class="window" style="width: 600px">
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
</template>
