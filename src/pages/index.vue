<script setup lang="ts">
import { state, startNewRound } from '~/state'
import { useTimer } from '~/state'

const { timeLeft } = useTimer()

const handleKeydown = async (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey && state.inputText && state.activeQuestion) {
    const validLocal = state.activeQuestion.validateLocally(state.inputText)
    const validLLM = validLocal || await validateWithLLM(state.activeQuestion, state.inputText)

    if (validLocal || validLLM) {
      state.currentRound++
      startNewRound()
    }
  } else if (e.key === 'Escape') {
    startNewRound()
  }
}

onMounted(startNewRound)
</script>

<template>
  <div class="window" style="width: 600px">
    <div class="title-bar">
      <div class="title-bar-text">Type This!</div>
    </div>
    <div class="window-body">
      <div class="prompt mb-4 text-2xl font-mono">
        {{ state.activeQuestion?.prompt }}
      </div>
      <textarea
        v-model="state.inputText"
        rows="3"
        autofocus
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>
