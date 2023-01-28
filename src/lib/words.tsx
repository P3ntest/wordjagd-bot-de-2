const files = import.meta.glob("./dictionaries/*.txt");

let wordLists: Wordlist[] = [];

export type Wordlist = {
  name: string;
  words: string[];
};

async function loadWordLists() {
  if (wordLists.length !== 0) return;
  wordLists = [];
  console.log("loading files", files);
  for (const path in files) {
    const module = await import(path + "?raw");
    const name = path.split("/").pop()?.split(".")[0] as string;
    wordLists.push({ name, words: module.default.split("\n") });
  }
  console.log("lists", wordLists);
}

export async function getWordLists() {
  await loadWordLists();
  return wordLists;
}

export function getWordList(name: string): string[] {
  return wordLists.find((list) => list.name === name)?.words || [];
}
