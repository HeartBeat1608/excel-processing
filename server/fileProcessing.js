const csv = require("csv-parser");
const fs = require("fs");

const processFile = (file) => {
  const filename = `${Date.now()}.csv`;
  const filePath = `${__dirname}\\public\\uploads\\${filename}`;

  fs.writeFileSync(filePath, file.data, {
    encoding: "utf-8",
  });

  const stream = fs.createReadStream(filePath, {
    autoClose: true,
  });
  let results = [];

  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on("data", (res) => results.push(res))
      .on("error", (err) => {
        fs.unlinkSync(filePath);
        results = [];
        reject(err);
      })
      .on("end", () => {
        fs.unlinkSync(filePath);
        resolve(results);
      });
  });
};

module.exports = {
  processFile,
};
