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
