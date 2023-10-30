const challenge = "cunmhsnmmrenezpe";

const withpath = await fetch(
  `http://localhost:3000/solve?challenge=${challenge}&dictionaries=Netzmafia%2CDavidak%2CWikipediaSP&path=true`
).then((res) => res.json());

const withoutPath = await fetch(
  `http://localhost:3000/solve?challenge=${challenge}&dictionaries=Netzmafia%2CDavidak%2CWikipediaSP`
).then((res) => res.json());

console.log(withpath.length, withoutPath.length);
