import {MicroGame, Question} from "~/types";

export const createBasicTypingMicrogame = (): MicroGame => ({
  generateQuestion(difficulty: number): Question {
    const target = 'START'; // Temporary hardcoded value for testing

    // const length = 5 + 2*difficulty
    // https://random-word-api.vercel.app/api?words=1&length=9

    return new Question(
      `type "${target}"`,
      [target],
      [],
      `Exact match to ${target}`,
      `Should have typed: ${target}`,
      (input: string) => input === target,
      10 // Time limit in seconds
    )
  }
})
