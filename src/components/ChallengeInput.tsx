import { useState } from "react";
import { Challenge, emptyChallenge } from "../lib/challange";
import "./ChallengeInput.css";

export default function ChallengeInput({
  challenge,
  setChallenge,
}: {
  challenge: Challenge;
  setChallenge: (challenge: Challenge) => void;
}) {
  return (
    <div className="field">
      {challenge.map((char, idx) => {
        return (
          <CharInput
            key={idx}
            char={char}
            setChar={(newChar: string) => {
              const nextChallenge = [...challenge] as Challenge;
              nextChallenge[idx] = newChar;
              setChallenge(nextChallenge);
            }}
          />
        );
      })}
    </div>
  );
}

function CharInput({
  char,
  setChar,
}: {
  char: string;
  setChar: (char: string) => void;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length !== 0) {
      // Move to next except when deleting
      const nextElementSibling = e.target
        .nextElementSibling as HTMLInputElement | null;

      if (nextElementSibling) {
        nextElementSibling.focus();
      }
    }

    const input = e.target.value.toUpperCase().slice(-1);

    setChar(input);
  };
  return (
    <input
      type="text"
      value={char}
      onChange={onChange}
      className="char shadow-xl rounded-lg bg-slate-700 text-slate-300 text-6xl align-middle outline-none focus:bg-slate-900 transition-all"
    />
  );
}
