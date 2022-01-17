export type Answer = {
  value: string;
  state: "correct" | "incorrect_position" | "incorrect" | null;
};
