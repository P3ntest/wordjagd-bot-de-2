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

export function challengeFromString(challengeString: string): Challenge {
  return challengeString.split("") as Challenge;
}

export function solveForList(
  challenge: Challenge,
  wordlist: string[]
): string[] {
  console.log("Solving with " + wordlist.length + " words");
  return wordlist
    .filter((word) => {
      const firstChar = word[0];

      const firstCharPositions = challenge
        .map((char, idx) => {
          if (char.toLowerCase() === firstChar.toLowerCase()) {
            return idx;
          }
        })
        .filter((position) => position !== undefined) as number[];

      for (const firstCharPosition of firstCharPositions) {
        const nextChallenge = [...challenge] as Challenge;
        nextChallenge[firstCharPosition] = "";
        if (solveChar(nextChallenge, word.slice(1), firstCharPosition)) {
          return true;
        }
      }

      return false;
    })
    .sort((a, b) => b.length - a.length);
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
