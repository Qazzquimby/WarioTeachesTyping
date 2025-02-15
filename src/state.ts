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
  gameOver: boolean
  score: number
}

export const state = reactive<GameState>({
  currentRound: 1,
  lives: 3,
  inputText: '',
  gameOver: false,
  score: 0
})

let timeLeft = ref(10)
export const useTimer = () => ({ timeLeft })


export function resetGame() {
  state.currentRound = 1
  state.lives = 3
  state.inputText = ''
  state.gameOver = false
  state.score = state.currentRound - 1
  state.activeQuestion = undefined
  timeLeft.value = 10
}

export async function startNewRound() {
  const gameIndex = state.currentRound % microgames.length
  const microgame = microgames[gameIndex]()
  
  state.activeQuestion = await microgame.generateQuestion(0)
  state.inputText = ''
  timeLeft.value = state.activeQuestion.timeLimit
}
