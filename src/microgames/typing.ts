import type { MicroGame, Question } from '~/types'

export const createBasicTypingMicrogame = (): MicroGame => ({
  generateQuestion(difficulty: number): Question {
    const targets = ['MUSHROOM', 'BANANA', 'PIZZA']
    const target = targets[Math.min(difficulty, targets.length - 1)]
    
    return {
      prompt: `TYPE "${target}" EXACTLY!`,
      hint: `Should have typed: ${target}`,
      acceptedAnswers: [target],
      rejectedAnswers: [],
      validationDescription: `Exact match to ${target} in uppercase`,
      validateLocally: (input: string) => input === target
    }
  }
})
