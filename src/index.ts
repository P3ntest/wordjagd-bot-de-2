import "dotenv/config";
import express from "express";
import "./dictionaries";
import morgan from "morgan";
import {
  getDictionaryMeta,
  loadDictionaries,
  mergeDictionaries,
} from "./dictionaries";
import { challengeFromString, solveForList } from "./challenge";
import { solveForListWithPath } from "./challengePattern";

const app = express();
app.use(morgan("dev"));

app.get("/dictionaries", async (req, res) => {
  await loadDictionaries();

  res.send(getDictionaryMeta());
});

app.get("/solve", async (req, res) => {
  const { challenge, dictionaries, path } = req.query;

  if (
    !challenge ||
    !dictionaries ||
    typeof dictionaries != "string" ||
    typeof challenge != "string"
  ) {
    res.status(400).send("Missing or incorrect query parameters");
    return;
  }

  if (challenge.length != 16) {
    res.status(400).send("Challenge must be 16 characters long");
    return;
  }

  const selectedDictionaries = dictionaries.split(",");

  const words = mergeDictionaries(selectedDictionaries);

  const result = (path === "true" ? solveForListWithPath : solveForList)(
    challengeFromString(challenge),
    words
  );

  res.send(result);
});

app.use(express.static("./client/dist"));

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
