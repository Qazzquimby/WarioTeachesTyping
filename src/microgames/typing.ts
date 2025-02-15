import {MicroGame, Question} from "~/types";
import {getRandomWord} from "~/composables/apis";

export const typeWordMicrogame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const length = 5 + 2 * difficulty
    const target = await getRandomWord(length)

    return new Question(
      `Type "${target}"`,
      [target],
      [],
      `Must match "${target}" exactly`,
      (input: string) => input.trim() === target,
      10
    )
  }
})

export const typeBackwardsWordForwards = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const length = 5 + 2 * difficulty
    let original = await getRandomWord(length)
    let reversed = original.split('').reverse().join('')

    return new Question(
      `Type "${reversed}" backwards`,
      [original],
      [],
      `Original word was: ${reversed}`,
      (input: string) => input.trim() === original,
      12
    )
  }
})

export const typeForwardsWordBackwards = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const length = 5 + 2 * difficulty
    let original = await getRandomWord(length)
    let reversed = original.split('').reverse().join('')

    return new Question(
      `Type "${original}" backwards`,
      [reversed],
      [],
      `Original word was: ${original}`,
      async (input: string) => input.trim() === reversed,
      14
    )
  }
})
