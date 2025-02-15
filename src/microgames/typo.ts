import { MicroGame, Question } from "~/types";
import { getRandomWord, getIsWord } from "~/composables/apis";

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

function getIsOneEditAway(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;

  let diff = 0;
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      if (diff >= 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
      diff++;
    } else {
      i++; j++;
    }
  }
  return (diff + Math.abs(a.length - i) + Math.abs(b.length - j)) === 1;
}

function addTypo(word: string): string {
  const typoType = Math.random();
  const pos = Math.floor(Math.random() * word.length);

  if (typoType < 0.33) { // Add extra letter
    return word.slice(0, pos) + word[pos] + word.slice(pos);
  } else if (typoType < 0.66) { // Remove letter
    return word.slice(0, pos) + word.slice(pos + 1);
  } else { // Replace letter
    const replacement = ALPHABET[Math.floor(Math.random() * 26)];
    return word.slice(0, pos) + replacement + word.slice(pos + 1);
  }
}

export const createTypoFixMicrogame = (): MicroGame => ({
  async generateQuestion(difficulty: number) {
    const wordLength = 5 + 2 * difficulty;
    let baseWord = '';

    // Get valid base word
    while (true) {
      baseWord = (await getRandomWord(wordLength)).toLowerCase();
      if (await getIsWord(baseWord)) break;
    }

    const typoVersion = addTypo(baseWord);
    const finalTypo = await getIsWord(typoVersion) ? addTypo(typoVersion) : typoVersion;

    return new Question(
      `Fix the typo in "${finalTypo}"`,
      [baseWord], // Accepted answers handled in validation
      [],
      "Must be valid English word with 1 character difference",
      async (submission: string) => {
        const sub = submission.toLowerCase().trim();
        const isWord = await getIsWord(sub)
        const isOneEditAway = getIsOneEditAway(sub, finalTypo.toLowerCase())
        return isWord && isOneEditAway
      },
      18
    );
  }
});

