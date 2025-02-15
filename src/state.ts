import { reactive, ref } from 'vue'
import type { Question } from './types'
import {
  typeWordMicrogame,
  typeBackwardsWordForwards,
  typeForwardsWordBackwards
} from './microgames/typing'
import { createMathMicrogame } from './microgames/math'

const microgames = [typeWordMicrogame, typeForwardsWordBackwards, typeBackwardsWordForwards, createMathMicrogame]

interface GameState {
  currentRound: number
  lives: number
  inputText: string
  activeQuestion?: Question
  gameOver: boolean
  score: number
  difficulty: number
  speed: number
}

export const state = reactive<GameState>({
  currentRound: 1,
  lives: 3,
  inputText: '',
  gameOver: false,
  score: 0,
  difficulty: 0,
  speed: 0
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

export function getSpeedMultiplier() {
  return Math.pow(0.75, state.speed)
}

export async function startNewRound() {
  const gameIndex = state.currentRound % microgames.length
  const microgame = microgames[gameIndex]()

  // Update progress system
  const prevRounds = state.currentRound - 1
  if (prevRounds % 2 === 0) { // Every 2 rounds
    if (state.difficulty >= 2) {
      state.difficulty = 0
      state.speed++
    } else {
      state.difficulty++
    }
  }

  state.activeQuestion = await microgame.generateQuestion(state.difficulty)
  state.inputText = ''

  // Set actual timer here instead of using variable
  const baseTime = state.activeQuestion.timeLimit
  const speedMultiplier = getSpeedMultiplier()
  timeLeft.value = Math.ceil(baseTime * speedMultiplier)
}
