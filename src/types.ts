export class Question {
  constructor(
    public prompt: string,
    public acceptedAnswers: string[],
    public rejectedAnswers: string[],
    public validationDescription: string, // For LLM grading
    public validateLocally: (input: string) => Promise<boolean>,
    public timeLimit: number = 10
  ) {
  }

  async validate(input: string): boolean {
    if (this.acceptedAnswers.includes(input)) {
      return true
    }
    if (this.rejectedAnswers.includes(input)) {
      return false
    }
    return await this.validateLocally(input)
  }
}

export interface MicroGame {
  generateQuestion(difficulty: number): Promise<Question>
}
