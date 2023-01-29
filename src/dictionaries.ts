import { readdir, readFile } from "fs/promises";
import { join } from "path";

export type Dictionary = {
  name: string;
  words: string[];
};

export type DictionaryMeta = {
  name: string;
  wordCount: number;
};

let dictionaries: Dictionary[] = [];

export function getDictionaryMeta(): DictionaryMeta[] {
  return dictionaries.map((dict) => ({
    name: dict.name,
    wordCount: dict.words.length,
  }));
}

export async function loadDictionaries() {
  console.log("Loading dictionaries...");
  if (dictionaries.length > 0) {
    console.log("Dictionaries already loaded. Skipping...");
    return;
  }

  let files = await readdir(join(__dirname, "..", "dictionaries"));

  files = files.filter((file) => file.endsWith(".txt"));

  console.log("Found", files.length, "dictionaries: ", files.join(", "));

  for (const file of files) {
    console.log("Loading dictionary: " + file);
    const path = join(__dirname, "..", "dictionaries", file);
    const contents = (await readFile(path)).toString();
    const words = contents.split("\n");
    const name = file.split(".")[0];
    dictionaries.push({ name: name, words: words });
    console.log(
      "Loaded dictionary: " + name + " with " + words.length + " words"
    );
  }
}

export function mergeDictionaries(names: string[]): string[] {
  const selectedDictionaries = dictionaries.filter((dict) =>
    names.includes(dict.name)
  );

  let merged = selectedDictionaries.flatMap((dict) => dict.words);

  merged = merged.map((word) => word.toLowerCase());

  // remove duplicates

  merged = [...new Set(merged)];

  return merged;
}

loadDictionaries();
