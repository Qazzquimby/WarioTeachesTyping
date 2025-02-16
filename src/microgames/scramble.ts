import { MicroGame, Question } from "~/types";
import { getRandomWord, getIsWord } from "~/composables/apis";

function scrambleWord(word: string): string {
  const characters = word.split('');
  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }
  return characters.join('');
}

export const createScrambleMicrogame = (): MicroGame => ({
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

    let scrambled = scrambleWord(baseWord);
    // Ensure scrambled version isn't the same as original
    while (scrambled === baseWord) {
      scrambled = scrambleWord(baseWord);
    }

    return new Question(
      `Unscramble: ${scrambled}`,
      [baseWord], // Original word still valid but not required
      [],
      "Must be valid English word using all letters",
      async (submission: string) => {
        const sub = submission.toLowerCase().trim();
        if (!sub) return false;

        const isRealWord = await getIsWord(sub);
        if (!isRealWord) return false;

        const normalize = (s: string) => s.split('').sort().join('');
        return normalize(sub) === normalize(baseWord);
      },
      18 // Longer time for letter comparison
    );
  }
});
