export type Challenge = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

export function emptyChallenge(): Challenge {
  return new Array(16).fill("") as Challenge;
}

export function isComplete(challenge: Challenge) {
  return challenge.every((char) => char !== "");
}

export function solveList(challenge: Challenge, wordlist: string[]): string[] {
  return wordlist.filter((word) => {
    console.log("looking for", word);
    const firstChar = word[0];

    const firstCharPositions = challenge
      .map((char, idx) => {
        if (char.toLowerCase() === firstChar.toLowerCase()) {
          return idx;
        }
      })
      .filter((position) => position !== undefined) as number[];

    for (const firstCharPosition of firstCharPositions) {
      console.log("trying first position", firstCharPosition);
      const nextChallenge = [...challenge] as Challenge;
      nextChallenge[firstCharPosition] = "";
      if (solveChar(nextChallenge, word.slice(1), firstCharPosition)) {
        return true;
      }
    }

    return false;
  });
}

function getNeighbouringPositions(currentPosition: number): number[] {
  const neighbours: number[] = [];

  const left = currentPosition % 4 !== 0;
  const right = currentPosition % 4 !== 3;
  const top = currentPosition >= 4;
  const bottom = currentPosition <= 11;

  if (left) {
    neighbours.push(currentPosition - 1);
    if (top) {
      neighbours.push(currentPosition - 5);
    }
    if (bottom) {
      neighbours.push(currentPosition + 3);
    }
  }

  if (right) {
    neighbours.push(currentPosition + 1);
    if (top) {
      neighbours.push(currentPosition - 3);
    }
    if (bottom) {
      neighbours.push(currentPosition + 5);
    }
  }

  if (top) {
    neighbours.push(currentPosition - 4);
  }

  if (bottom) {
    neighbours.push(currentPosition + 4);
  }

  return neighbours.filter((position) => {
    return position >= 0 && position < 16;
  });
}

function solveChar(
  remainingChallenge: Challenge,
  remainingWord: string,
  currentPosition: number
): boolean {
  if (remainingWord.length === 0) {
    return true;
  }

  const nextChar = remainingWord[0];

  const neighboursPositions = getNeighbouringPositions(currentPosition);

  console.log(
    "remaining word",
    remainingWord,
    "next char",
    nextChar,
    "neighbours",
    neighboursPositions
  );

  for (const neighbourPosition of neighboursPositions) {
    if (
      remainingChallenge[neighbourPosition].toLowerCase() ===
      nextChar.toLowerCase()
    ) {
      const nextChallenge = [...remainingChallenge] as Challenge;
      nextChallenge[neighbourPosition] = "";
      const solved = solveChar(
        nextChallenge,
        remainingWord.slice(1),
        neighbourPosition
      );
      if (solved) {
        return true;
      }
    }
  }

  return false;
}
