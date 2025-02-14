export interface MicroGame {
  generateQuestion(difficulty: number): Question
}

export interface Question {
  prompt: string
  acceptedAnswers: string[]
  rejectedAnswers: string[]
  validationDescription: string // For LLM grading
  hint: string
  validateLocally(input: string): boolean
}
