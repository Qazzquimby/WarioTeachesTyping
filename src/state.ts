import { reactive, ref } from 'vue'
import type { Question } from './types'
import { createBasicTypingMicrogame } from './microgames/typing'

interface GameState {
  currentRound: number
  lives: number
  inputText: string
  activeQuestion?: Question
}

export const state = reactive<GameState>({
  currentRound: 1,
  lives: 3,
  inputText: '',
})

let timeLeft = ref(10)
export const useTimer = () => ({ timeLeft })


export function startNewRound() {
  state.activeQuestion = createBasicTypingMicrogame().generateQuestion(0)
  state.inputText = ''
  timeLeft.value = 10
}
