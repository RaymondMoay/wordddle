import { useEffect, useMemo, useState } from "react";
import { delay } from "../utils/delay";

type Answer = {
  value: string;
  state: "correct" | "incorrect_position" | "incorrect" | null;
};

const WORD = "lunar"; // this should come from static props reading Excel's APIs
const BASE_ANSWER: Answer = {
  value: "",
  state: null,
};

export default function Home() {
  const initArr = useMemo(() => {
    const initial: Answer[][] = new Array(6).fill("");
    // initialize answers (0(6n))
    for (let i = 0; i < initial.length; i++) {
      let arr: Answer[] = [];
      for (let k = 0; k < WORD.length; k++) {
        arr.push({ ...BASE_ANSWER });
      }
      initial[i] = arr;
    }
    return initial;
  }, []);
  const [tries, setTries] = useState(0);
  const [cursor, setCursor] = useState(0);
  // fun fact: I can't just do new Array(6).fill(BASE_VALUE) here because fill apparently points to the
  // same object in the "universe", thus mutating it mutates all objects.
  const [answers, setAnswers] = useState<Answer[][]>(initArr);

  function numOfLetterInWord(letter: string, word: string): number {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
      if (letter === word[i]) count += 1;
    }
    return count;
  }

  // handle keyboard input...
  useEffect(() => {
    async function handleKeyDown(e: KeyboardEvent) {
      const letters = "abcdefghijklmnopqrstuvwxyz";
      if (letters.includes(e.key)) {
        setCursor((c) => {
          if (c < WORD.length) {
            const newAnswers = [...answers];
            newAnswers[tries][cursor].value = e.key;
            setAnswers(newAnswers);
            return c + 1;
          }
          return WORD.length;
        });
      }
      if (e.key === "Backspace") {
        setCursor((c) => {
          if (c > 0) {
            const newAnswers = [...answers];
            newAnswers[tries][cursor - 1].value = "";
            setAnswers(newAnswers);
            return c - 1;
          }
          return 0;
        });
      }
      if (e.key === "Enter") {
        if (
          tries <= 5 &&
          answers[tries].filter((answer) => answer.value !== "").length ===
            WORD.length
        ) {
          let nCorrect = 0;
          // to check for repeating alphabets
          let possiblyCorrectLetters = "";
          for (let i = 0; i < answers[tries].length; i++) {
            await delay(300);
            let letterToTest = answers[tries][i].value.toLowerCase();
            if (letterToTest === WORD[i]) {
              nCorrect += 1;
              setAnswers((a) => {
                const newAnswer = [...a];
                newAnswer[tries][i].state = "correct";
                return newAnswer;
              });
              possiblyCorrectLetters += letterToTest;
            } else if (WORD.includes(letterToTest)) {
              setAnswers((a) => {
                const newAnswer = [...a];
                if (
                  possiblyCorrectLetters.includes(letterToTest) &&
                  numOfLetterInWord(letterToTest, possiblyCorrectLetters) !==
                    numOfLetterInWord(letterToTest, WORD)
                ) {
                  newAnswer[tries][i].state = "incorrect_position";
                } else {
                  newAnswer[tries][i].state = "incorrect";
                }
                return newAnswer;
              });
              possiblyCorrectLetters += letterToTest;
            } else {
              setAnswers((a) => {
                const newAnswer = [...a];
                newAnswer[tries][i].state = "incorrect";
                return newAnswer;
              });
            }
          }
          await delay(300);
          if (nCorrect === WORD.length) {
            // Correct! move on to the next level...
          } else {
            if (tries < 5) {
              setCursor(0);
              setTries((t) => t + 1);
            }
          }
        }
        // game over, try again tomorrow...
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [answers, cursor, tries]);

  return (
    <div className="h-full w-full max-w-md mx-auto px-4 animate-fade-in-down">
      <div className="text-center">
        <h1 className="text-4xl font-bold pt-5">WORDDDLE</h1>
        <h2 className="text-2xl">Level 1</h2>
      </div>
      <div className="pt-10" />
      {answers.map((answer, aId) => {
        return (
          <div key={aId} className="flex gap-2 justify-center my-2">
            {answer.map((letter, lId) => {
              return (
                <div
                  key={lId}
                  className={`w-14 h-14 border ${
                    tries === aId ? "border-gray-500" : "border-gray-300"
                  } rounded-[5px] text-3xl flex items-center justify-center ${
                    letter.state === "correct"
                      ? "bg-green-300 border-green-300 animate-fade-in"
                      : letter.state === "incorrect_position"
                      ? "bg-yellow-300 border-yellow-300 animate-fade-in"
                      : letter.state === "incorrect"
                      ? "bg-gray-300 animate-fade-in"
                      : "bg-white"
                  }`}
                >
                  {letter.value.toUpperCase()}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* TODO KEYBOARD COMPONENT */}
    </div>
  );
}
