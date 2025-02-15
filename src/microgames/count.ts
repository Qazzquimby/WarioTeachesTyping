import { MicroGame, Question } from "~/types"
import {getRandomWord} from "~/composables/apis";

export const createLetterCountGame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const ranges = [7, 9, 11]
    const length = 5 + Math.floor(
      Math.random() * (ranges[difficulty] + 1 - 5)
  )

    const target = await getRandomWord(length)
    const answer = target.length.toString()

    return new Question(
      `How many letters in "${target}"?`,
      [answer],
      [],
      `String length is ${answer}`,
      (input) => input.trim() === answer,
      12
    )
  }
})
