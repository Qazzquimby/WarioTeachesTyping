export class Question {
  constructor(
    public prompt: string,
    public acceptedAnswers: string[],
    public rejectedAnswers: string[],
    public validationDescription: string, // For LLM grading
    public hint: string,
    public validateLocally: (input: string) => boolean
  ) {}
}

export interface MicroGame {
  generateQuestion(difficulty: number): Question
}
