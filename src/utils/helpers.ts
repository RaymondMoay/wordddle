import type { Answer } from "./types";

export async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export function numberOfLetterInWord(letter: string, word: string): number {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    if (letter === word[i]) count += 1;
  }
  return count;
}

export function generateInitialAnswers(
  word: string,
  tries: number
): Answer[][] {
  const initial: Answer[][] = new Array(tries).fill("");
  // initialize answers (0(6n))
  for (let i = 0; i < initial.length; i++) {
    let arr: Answer[] = [];
    for (let k = 0; k < word.length; k++) {
      arr.push({ value: "", state: null });
    }
    initial[i] = arr;
  }
  return initial;
}
