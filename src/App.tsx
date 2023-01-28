import { useEffect, useState } from "react";
import ChallengeInput from "./components/ChallengeInput";
import {
  Challenge,
  emptyChallenge,
  isComplete,
  solveList,
} from "./lib/challange";
import { getWordList, getWordLists, Wordlist } from "./lib/words";

interface Result {
  words: string[];
  challenge: Challenge;
  wordlist: string;
}

function App() {
  const [challenge, setChallenge] = useState<Challenge>(emptyChallenge());
  const [results, setResults] = useState<Result | null>(null);

  const [wordlist, setWordlist] = useState<string>("");
  const [wordlists, setWordlists] = useState<Wordlist[]>([]);

  useEffect(() => {
    getWordLists().then((lists) => {
      setWordlist(lists[0].name);
      setWordlists(lists);
    });
  }, []);

  const solve = () => {
    setResults({
      words: solveList(challenge, getWordList(wordlist)).sort(
        (a, b) => b.length - a.length
      ),
      challenge: [...challenge] as Challenge,
      wordlist,
    });
  };

  const reset = () => {
    setChallenge(emptyChallenge());
    setResults(null);
  };

  return (
    <div className="flex flex-col items-center pt-7 gap-5">
      <ChallengeInput challenge={challenge} setChallenge={setChallenge} />
      <div className="flex flex-row items-center gap-2">
        <h2 className="text-white text-lg font-bold">Dictionary:</h2>
        {JSON.stringify(wordlists)}awdawd
        <select
          name="wordlist"
          value={wordlist}
          onChange={(e) => setWordlist(e.target.value)}
          className="text-xl outline-none rounded bg-slate-600 text-white text-center px-3 py-2"
        >
          {wordlists.map((wordlist) => (
            <option value={wordlist.name} key={wordlist.name}>
              {wordlist.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3">
        <button className="btn bg-red-600" onClick={reset}>
          Reset
        </button>
        <button
          className="btn bg-green-600 disabled:bg-gray-600 transition-all"
          disabled={!isComplete(challenge)}
          onClick={solve}
        >
          Solve
        </button>
      </div>
      {results !== null ? (
        <>
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center">
              <h1 className="text-white font-bold text-2xl">Results</h1>
              <h2 className="text-slate-400 font-bold uppercase text-xs">
                {results.words.length} results found · "{results.wordlist}"
                dictionary
              </h2>
            </div>
            <div className="flex flex-col gap-1">
              {results.words.map((word) => (
                <div
                  key={word}
                  className="text-white text-2xl font-bold bg-slate-600 rounded p-1 m-1 uppercase flex flex-row items-center gap-3"
                >
                  {/* Set background color depending on word length from 1-10 */}
                  <div
                    className="rounded  w-8 h-8 text-center text-xl"
                    style={{
                      backgroundColor: `hsl(${
                        (word.length / 10) * 30
                      }, 100%, 50%)`,
                    }}
                  >
                    {word.length}
                  </div>
                  <p className="flex-1 text-center px-3">{word}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default App;
