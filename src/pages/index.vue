<script setup lang="ts">
import { state, startNewRound } from '~/state'
import { useTimer } from '~/state'

const { timeLeft } = useTimer()

const handleKeydown = async (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey && state.inputText && state.activeQuestion) {
    e.preventDefault()

    const validLocal = state.activeQuestion.validateLocally(state.inputText)
    // const validLLM = validLocal || await validateWithLLM(state.activeQuestion, state.inputText)
    if (validLocal) {
      console.log("win")
      state.currentRound++
      startNewRound()
    } else {
      console.log("lose")
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
      <div class="mb-4 text-2xl">
        {{ state.activeQuestion?.prompt }}
      </div>
      <textarea class="text-xl w-full p-2"
        v-model="state.inputText"
        rows="3"
        autofocus
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>
