import type { MicroGame, Question } from '~/types'

export const createBasicTypingMicrogame = (): MicroGame => ({
  generateQuestion(difficulty: number): Question {

    // todo call random word api, length varying by difficulty number (0-2)

    return {
      prompt: `type "${target}"`,
      hint: `Should have typed: ${target}`,
      acceptedAnswers: [target],
      rejectedAnswers: [],
      validationDescription: `Exact match to ${target}`,
      validateLocally: (input: string) => input === target
    }
  }
})
