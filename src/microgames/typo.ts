import { MicroGame, Question } from "~/types";
import { getRandomWord, getIsWord } from "~/composables/apis";

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

function addTypo(word: string): string {
  const typoType = Math.random();
  const pos = Math.floor(Math.random() * word.length);

  // 33% chance for each type of typo
  if (typoType < 0.33) { // Add extra letter
    return word.slice(0, pos) + word[pos] + word.slice(pos);
  }
  else if (typoType < 0.66) { // Remove letter
    return word.slice(0, pos) + word.slice(pos + 1);
  }
  else { // Replace letter
    const replacement = ALPHABET[Math.floor(Math.random() * 26)];
    return word.slice(0, pos) + replacement + word.slice(pos + 1);
  }
}

export const createTypoFixMicrogame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const wordLength = 5 + 2 * difficulty;

    const word = await getRandomWord(wordLength);
    const typoVersion = addTypo(word);

    function validate(submission: str) {
      const isWord = getIsWord(submission)
      const isSimilarToOriginalWord
      // TODO must be 1 letter different from the typo (added, removed, changed)
      return isWord && isSimilarToOriginalWord
    }

    return new Question(
      `Fix the typo in "${typoVersion}"`,
      [word],
      [],
      `English word 1 character away from ${word}`,
      validate,
      18
    );
  }
});

