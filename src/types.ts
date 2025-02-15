export class Question {
  constructor(
    public prompt: string,
    public acceptedAnswers: string[],
    public rejectedAnswers: string[],
    public validationDescription: string, // For LLM grading
    public validateLocally: (input: string) => boolean,
    public timeLimit: number = 10
  ) {}
}

export interface MicroGame {
  generateQuestion(difficulty: number): Promise<Question>
}
