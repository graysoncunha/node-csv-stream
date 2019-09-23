const fs = require("fs");

const stream = require("stream");
const Transform = stream.Transform;

const createReadStream = fs.createReadStream;
const createWriteStream = fs.createWriteStream;

const transformCsvToObject = new Transform({
  transform: function transformer(chunk, encoding, callback) {
    const [cabecalhoCsv, ...linhasCsv] = chunk.split("\r");
    const nomesColunasCsv = cabecalhoCsv.split(";");

    const arrayObjs = linhasCsv.reduce((acc, linha) => {
      const valorCelulas = linha.split(";");
      const obj = nomesColunasCsv.reduce((acc, nomePropriedade, index) => {
        return {
          ...acc,
          [nomePropriedade.toLowerCase()]: valorCelulas[index].trim()
        };
      }, {});

      return [...acc, obj];
    }, []);

    callback(false, arrayObjs);
  },
  readableObjectMode: true,
  writableObjectMode: true
});

createReadStream("./mycsv.csv", "utf-8")
  .pipe(transformCsvToObject)
  .on("data", data => {
    console.log(data);
  });
