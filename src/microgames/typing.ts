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
      `Type "${target}"`,
      [target],
      [],
      `Must match "${target}" exactly`,
      (input: string) => input.trim() === target,
      10
    )
  }
})

export const createReverseTypingMicrogame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const length = 5 + 2 * difficulty
    let original = await getRandomWord(length)
    let reversed = original.split('').reverse().join('')

    const flip = Boolean(Math.round(Math.random()))
    if(flip) {
      let tempReversed = reversed;
      reversed = original;
      original = tempReversed
    }

    return new Question(
      `Type "${original}" backwards`,
      [reversed],
      [],
      `Original word was: ${original}`,
      (input: string) => input.trim() === reversed,
      12
    )
  }
})
