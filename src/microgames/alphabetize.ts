import { MicroGame, Question } from "~/types";
import { getRandomWord, getIsWord } from "~/composables/apis";

export const createAlphabetizeMicrogame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const lengthRanges = [[3,4], [4,5], [5,6]];
    const [minLength, maxLength] = lengthRanges[difficulty];
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let baseWord = '';
    // Get valid base word
    while (true) {
      baseWord = (await getRandomWord(length)).toLowerCase();
      if (await getIsWord(baseWord)) break;
    }

    const sorted = baseWord.split('').sort().join('');

    return new Question(
      `Alphabetize: ${baseWord}`,
      [sorted],
      [],
      "Must sort letters A→Z",
      async (submission: string) => {
        return submission.toLowerCase().trim() === sorted;
      },
      15 // Time limit matches scramble game difficulty
    );
  }
});
