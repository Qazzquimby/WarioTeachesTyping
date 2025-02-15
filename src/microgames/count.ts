import { MicroGame, Question } from "~/types"
import {getRandomWord} from "~/composables/apis";

export const createLetterCountGame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const lengths = [5, 8, 11]
    const target = await getRandomWord(lengths[Math.min(difficulty, 2)])
    const answer = target.length.toString()

    return new Question(
      `How many letters in "${target}"?`,
      [answer, ` ${answer}`, `${answer} `], // Allow space variations
      [],
      `String length is ${answer}`,
      (input) => input.trim().replace(/letters?/gi, '').trim() === answer,
      15
    )
  }
})
