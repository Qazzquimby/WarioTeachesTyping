import {MicroGame, Question} from "~/types";

async function getRandomWord(length: number): Promise<string> {
  try {
    const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${length}`)
    const [word] = await response.json()
    return word
  } catch {
    // Fallback if API fails
    const fallback = Math.random().toString(36).substring(2, 2+length)
    return fallback
  }
}

export const createBasicTypingMicrogame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const length = 5 + 2 * difficulty
    const target = await getRandomWord(length)

    return new Question(
      `type "${target}"`,
      [target],
      [],
      `Exact match to ${target}`,
      (input: string) => input.trim() === target,
      10
    )
  }
})

export const createReverseTypingMicrogame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const length = 5 + 2 * difficulty
    const original = await getRandomWord(length)
    const reversed = original.split('').reverse().join('')

    return new Question(
      `type "${original}" backwards`,
      [original],
      [],
      `Must be original word spelled backwards`,
      (input: string) => input.trim() === reversed,
      12
    )
  }
})
