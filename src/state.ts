import { reactive, ref } from 'vue'
import type { Question } from './types'
import { createBasicTypingMicrogame, createReverseTypingMicrogame } from './microgames/typing'

// Add game type rotation
const microgames = [createBasicTypingMicrogame, createReverseTypingMicrogame]

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


export async function startNewRound() {
  const gameIndex = state.currentRound % microgames.length
  const microgame = microgames[gameIndex]()
  
  state.activeQuestion = await microgame.generateQuestion(0)
  state.inputText = ''
  timeLeft.value = state.activeQuestion.timeLimit
}
