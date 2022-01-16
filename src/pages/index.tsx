import { useEffect, useState } from "react";

export default function Home() {
  const [answers, setAnswers] = useState([
    ["A", "P", "P", "L", "E"],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  // handle keyboard input...

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const letters = "abcdefghijklmnopqrstuvwxyz";
      if (letters.includes(e.key)) {
        console.log(e.key);
      }

      if (e.key === "Backspace") {
        console.log("Handle backspace");
      }

      if (e.key === "Enter") {
        console.log("Submit answer");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-full w-full max-w-md mx-auto px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold pt-5">WORDDDLE</h1>
        <h2 className="text-2xl">Level 1</h2>
      </div>
      <div className="pt-10" />
      {answers.map((answer, index) => {
        return (
          <div key={index} className="flex gap-2 justify-center my-2">
            {answer.map((letter, index) => {
              return (
                <div
                  key={index}
                  className="w-14 h-14 border border-gray-500 rounded-sm text-3xl flex items-center justify-center"
                >
                  {answer[index]}
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
