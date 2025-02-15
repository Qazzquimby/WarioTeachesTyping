import { MicroGame, Question } from "~/types"

function mathMicrogame(difficulty: number): Question {
  const ranges = {
    add: [10, 20, 50][difficulty],
    multiply: [5, 10, 15][difficulty]
  }

  const operation = Math.random() > 0.5 ? 'multiply' : 'add'
  const [a, b] = [
    Math.floor(Math.random() * (ranges[operation] + 1)),
    Math.floor(Math.random() * (ranges[operation] + 1))
  ]

  let prompt = ''
  let answer: number
  let timeLimit = 12

  if (operation === 'add') {
    prompt = `${a} + ${b}`
    answer = a + b
  } else {
    prompt = `${a} × ${b}`
    answer = a * b
    timeLimit = 15
  }

  return new Question(
    `Calculate: ${prompt}`,
    [answer.toString()],
    [],
    `Solution: ${prompt} = ${answer}`,
    async (input: string) => {
      return parseInt(input.trim(), 10) === answer
    },
    timeLimit
  )
}

export const createMathMicrogame = (): MicroGame => ({
 async generateQuestion(difficulty: number) {
    return mathMicrogame(Math.min(difficulty, 2))
  }
})
