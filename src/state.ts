import { reactive, ref } from 'vue'
import type { Question } from './types'

interface GameState {
  currentRound: number
  lives: number
  inputText: string
  activeQuestion?: Question
  userAPIKey: string
}

export const state = reactive<GameState>({
  currentRound: 1,
  lives: 3,
  inputText: '',
  userAPIKey: localStorage.getItem('openrouter-key') || ''
})

let timeLeft = ref(10)
export const useTimer = () => ({ timeLeft })


export function startNewRound() {
   state.activeQuestion = createBasicTypingMicrogame().generateQuestion(0) // Start with difficulty 0
   state.inputText = ''
   timeLeft.value = 10
 }
