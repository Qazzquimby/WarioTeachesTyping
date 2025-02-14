<script setup lang="ts">
import { state, startNewRound } from '~/state'
import { useTimer } from '~/state'

const { timeLeft } = useTimer()

watchEffect(async () => {
  if (state.inputText && state.activeQuestion) {
    const validLocal = state.activeQuestion.validateLocally(state.inputText)
    const validLLM = validLocal || await validateWithLLM(state.activeQuestion, state.inputText)

    if (validLocal || validLLM) {
      state.currentRound++
      startNewRound()
    }
  }
})

onMounted(startNewRound)
</script>

<template>
  <div class="prompt my-8 text-4xl font-mono">
    {{ state.activeQuestion?.prompt }}
  </div>
  <input
    v-model="state.inputText"
    class="w-96 border-2 p-4 text-2xl"
    autofocus
    @keydown.esc="startNewRound()"
  >
</template>
