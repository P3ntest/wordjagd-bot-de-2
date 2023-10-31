import { readFile } from "fs/promises";
import { createPrompt } from "bun-promptx";

const startX = 0xd6;
const startY = 0x4c6;
const endX = 0x35c;
const endY = 0x741;
const step = (endX - startX) / 3;

const device = "17301JEC201127";

async function tap(x: number, y: number) {
  await shell(`input tap ${x} ${y}`);
}

async function shell(command: string) {
  await runAdbCommand(`-s ${device} shell ${command}`);
}

async function runAdbCommand(command: string) {
  const { stdout, stderr } = Bun.spawn(["adb", ...command.split(" ")]);

  const stdoutStr = await new Response(stdout).text();
  const stderrStr = await new Response(stderr).text();

  //   console.log(stdoutStr);
  //   console.log(stderrStr);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// await shell(
//   `input touchscreen swipe ${startX} ${startY} ${endX} ${startY} 1000
//    input touchscreen swipe ${endX} ${startY} ${endX} ${endY}`
// );
// await shell(
//   `input touchscreen draganddrop ${startX} ${startY} ${endX} ${startY} 1000 &&
//   input touchscreen draganddrop ${endX} ${startY} ${endX} ${endY} 1000`
// );
// await shell(`sendevent`);

// shell(
//   `
//   input touchscreen draganddrop ${startX} ${startY} ${startX} ${startY} 100 &
//     input touchscreen tap ${startX + step} ${startY + step} &
//     input touchscreen tap ${startX + step * 2} ${startY} &
//   `
// );

async function pattern(points: number[][]) {
  points = points.map(([x, y]) => [x * step + startX, y * step + startY]);

  //   const totalLength = 600 - (10 - points.length) * 15;
  const totalLength = points.length * 60 + 100;

  const stepLength = Math.floor(totalLength / points.length);

  let length = points.length * stepLength + 30;
  for (const [x, y] of points) {
    shell(`input touchscreen draganddrop ${x} ${y} ${x} ${y} ${length}`);
    length -= stepLength;
    await sleep(stepLength);
  }
}

const challenge = createPrompt("Challenge: ").value?.toUpperCase();

let wordlist = [];

// const over5words = await fetch(
//   `http://localhost:3000/solve?challenge=${challenge}&dictionaries=Netzmafia%2CDavidak%2CWikipediaSP&path=true`
// ).then((res) => res.json());
// const under5 = await fetch(
//   `http://localhost:3000/solve?challenge=${challenge}&dictionaries=Netzmafia%2CDavidak&path=true`
// ).then((res) => res.json());

// wordlist = [
//     ...over5words.filter((w) => w.word.length >= 5),
//     ...under5.filter((w) => w.word.length < 5),
// ];

const simple = await fetch(
  `http://localhost:3000/solve?challenge=${challenge}&dictionaries=ghmarvin&path=true`
).then((res) => res.json());
wordlist = simple;

console.log(wordlist.length, "words found");

let remainingWords = [...wordlist];

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    if (pathname.startsWith("/skipto")) {
      const [, , index] = pathname.split("/");
      const length = parseInt(index);
      const beforeLength = remainingWords.length;
      remainingWords = remainingWords.filter(
        (word) => word.word.length <= length
      );
      console.log(
        `Filtered ${
          beforeLength - remainingWords.length
        } words with length > ${length}`
      );
      return new Response("ok");
    }
  },
  port: 6969,
});

while (remainingWords.length > 0) {
  const word = remainingWords[0];
  const retryAmount = word.word.length >= 6 ? 2 : 1;
  for (let i = 0; i < retryAmount; i++) {
    await pattern(word.path);
    await sleep(400);
  }
  console.log("tried", word.word, "remaining", remainingWords.length);
  remainingWords = remainingWords.slice(1);
}

process.exit(0);
// pattern([
//   [3, 3],
//   [3, 2],
//   [2, 1],
//   [1, 0],
//   [0, 0],
//   [1, 1],
//   [0, 2],
//   [1, 3],
//   [2, 3],
// ]);

// shell(
//   `input touchscreen draganddrop ${startX} ${startY} ${startX} ${startY} 45`
// );
// await sleep(10);
// shell(
//   `input touchscreen swipe ${startX + step} ${startY + step} ${startX + step} ${
//     startY + step
//   } 35`
// );
// await sleep(10);
// shell(
//   `input touchscreen draganddrop ${startX + step * 2} ${startY + step * 2} ${
//     startX + step * 2
//   } ${startY + step * 2} 25`
// );
// await sleep(10);
// shell(
//   `input touchscreen draganddrop ${startX + step * 3} ${startY + step * 3} ${
//     startX + step * 3
//   } ${startY + step * 3} 15`
// );
