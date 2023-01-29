import { useEffect, useState } from "react";
import ChallengeInput from "./components/ChallengeInput";
import { Challenge, emptyChallenge, isComplete } from "./lib/challange";

interface Result {
  words: string[];
  challenge: Challenge;
  dictionaries: DictionaryMeta[];
}

type DictionaryMeta = {
  name: string;
  wordCount: number;
};

function App() {
  const [challenge, setChallenge] = useState<Challenge>(emptyChallenge());
  const [results, setResults] = useState<Result | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [availableDictionaries, setAvailableDictionaries] = useState<
    DictionaryMeta[]
  >([]);
  const [selectedDictionaries, setSelectedDictionaries] = useState<
    DictionaryMeta[]
  >([]);

  useEffect(() => {
    (async () => {
      const dictionaries = await fetch("/dictionaries");
      const json = await dictionaries.json();

      setAvailableDictionaries(json);
    })();
  }, []);

  const solve = async () => {
    setLoading(true);
    const response = await fetch(
      "/solve?challenge=" +
        challenge.join("") +
        "&dictionaries=" +
        selectedDictionaries.map((dict) => dict.name).join(",")
    );

    const words = await response.json();

    setResults({
      words,
      challenge: [...challenge] as Challenge,
      dictionaries: [...selectedDictionaries],
    });

    setLoading(false);
  };

  const reset = () => {
    setChallenge(emptyChallenge());
    setResults(null);
  };

  return (
    <div className="flex flex-col items-center pt-7 gap-5">
      <ChallengeInput challenge={challenge} setChallenge={setChallenge} />
      <div className="flex flex-row items-center gap-2">
        <DictionarySelector
          dictionaries={availableDictionaries}
          selectedDictionaries={selectedDictionaries}
          setSelectedDictionaries={setSelectedDictionaries}
        />
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
      {
        // Show loading spinner if loading
        loading ? (
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-white font-bold text-xl">Loading...</h2>
          </div>
        ) : results !== null ? (
          <>
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col items-center">
                <h1 className="text-white font-bold text-2xl">Results</h1>
                <h2 className="text-slate-400 font-bold uppercase text-xs text-center">
                  {results.words.length} results found ·
                  {results.dictionaries
                    .map((dict) => `"${dict.name}"`)
                    .join(", ")}{" "}
                  used
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
        ) : null
      }
    </div>
  );
}

function DictionarySelector({
  dictionaries,
  selectedDictionaries,
  setSelectedDictionaries,
}: {
  dictionaries: DictionaryMeta[];
  selectedDictionaries: DictionaryMeta[];
  setSelectedDictionaries: (dictionaries: DictionaryMeta[]) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <h2 className="text-white text-lg font-bold">Dictionaries:</h2>
      <div className="flex flex-col items-start gap-2">
        {dictionaries.map((dictionary) => (
          <div
            key={dictionary.name}
            className="flex flex-row items-center gap-2"
          >
            <input
              type="checkbox"
              checked={selectedDictionaries.includes(dictionary)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedDictionaries([
                    ...selectedDictionaries,
                    dictionary,
                  ]);
                } else {
                  setSelectedDictionaries(
                    selectedDictionaries.filter(
                      (d) => d.name !== dictionary.name
                    )
                  );
                }
              }}
            />
            <p className="text-white">{dictionary.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
