import { useEffect, useState } from "react";
import {
  delay,
  generateInitialAnswers,
  numberOfLetterInWord,
} from "../utils/helpers";
import type { Answer } from "../utils/types";

// WORDS should come from API fetch
const WORDS = ["bay", "hawk", "local", "toggle", "achieve", "academic"];

export default function Home() {
  const [level, setLevel] = useState(0);
  const [tries, setTries] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [answers, setAnswers] = useState<Answer[][]>(
    generateInitialAnswers(WORDS[level], 6)
  );
  const [animating, setAnimating] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  function checkAnswer(word: String, answer: Answer[]): Answer[] {
    // create a final answer with NEW objects so we don't mutate the original state by accident.
    let finalAnswer: Answer[] = answer.map((ans) => ({ ...ans }));
    let remainingWord = "";
    let checkedAnswerIdx = [];

    // 1. Check all correct answers and remove them...
    for (let i = 0; i < answer.length; i++) {
      if (answer[i].value === word[i]) {
        finalAnswer[i].state = "correct";
        checkedAnswerIdx.push(i);
      } else {
        remainingWord += word[i];
      }
    }
    // 2. Remaining are either (2.1) outright wrong or (2.2) wrong position.
    // 2.1 Remove all wrong answers.
    for (let i = 0; i < answer.length; i++) {
      if (
        !checkedAnswerIdx.includes(i) &&
        !remainingWord.includes(answer[i].value)
      ) {
        finalAnswer[i].state = "incorrect";
        checkedAnswerIdx.push(i);
      }
    }

    // 2.2 Handle the remaining which are either wrong position or duplicates.
    let wrongPositionWordsChecked = "";
    for (let i = 0; i < answer.length; i++) {
      let noLettersInRemaining = numberOfLetterInWord(
        answer[i].value,
        remainingWord
      );
      let noLettersInWrongPositionChecked = numberOfLetterInWord(
        answer[i].value,
        wrongPositionWordsChecked
      );

      if (
        !checkedAnswerIdx.includes(i) &&
        noLettersInWrongPositionChecked < noLettersInRemaining
      ) {
        finalAnswer[i].state = "incorrect_position";
        wrongPositionWordsChecked += finalAnswer[i].value;
      } else if (!checkedAnswerIdx.includes(i)) {
        finalAnswer[i].state = "incorrect";
      }
    }

    return finalAnswer;
  }

  useEffect(() => {
    async function handleKeyDown(e: KeyboardEvent) {
      if (animating) return;
      const letters = "abcdefghijklmnopqrstuvwxyz";
      if (letters.includes(e.key)) {
        setCursor((c) => {
          if (c < WORDS[level].length) {
            const newAnswers = [...answers];
            newAnswers[tries][cursor].value = e.key;
            setAnswers(newAnswers);
            return c + 1;
          }
          return WORDS[level].length;
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
            WORDS[level].length
        ) {
          let checkedAnswer = checkAnswer(WORDS[level], answers[tries]);
          setAnimating(true);
          for (let i = 0; i < answers[tries].length; i++) {
            await delay(300);
            setAnswers((a) => {
              const newAnswer = [...a];
              newAnswer[tries][i].state = checkedAnswer[i].state;
              return newAnswer;
            });
          }
          await delay(300);

          if (checkedAnswer.map((ans) => ans.value).join("") === WORDS[level]) {
            // Correct! move on to the next level...
            setCursor(0);
            setTries(0);
            if (level !== WORDS.length - 1) {
              setAnswers(generateInitialAnswers(WORDS[level + 1], 6));
              setLevel((l) => l + 1);
            } else {
              // complete game, come back tmr
              // show summary
            }
          } else {
            if (tries < 5) {
              setCursor(0);
              setTries((t) => t + 1);
            } else {
              // game over, try again tomorrow...
              setGameOver(true);
            }
          }
          setAnimating(false);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [answers, cursor, tries, level, animating]);

  return (
    <div className="h-full w-full max-w-md mx-auto px-4 animate-fade-in-down">
      <div className="text-center">
        <h1 className="text-4xl font-bold pt-5">WORDDDLE</h1>
        <h2 className="text-2xl">Level {level + 1}</h2>
      </div>
      <div className="pt-10" />
      {answers.map((answer, aId) => {
        return (
          <div key={aId} className="flex space-x-2 justify-center my-2">
            {answer.map((letter, lId) => {
              return (
                <div
                  key={lId}
                  className={`w-10 h-10 md:w-14 md:h-14 border ${
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
