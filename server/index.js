const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { processFile } = require("./fileProcessing");
const { uploadFileToS3 } = require("./s3");

const app = express();

app.use(cors());

app.use(
  fileUpload({
    abortOnLimit: true,
    responseOnLimit: "Size Limit Reached",
    preserveExtension: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

app.post("/process", async (req, res) => {
  const {
    files: { file },
  } = req;

  const isValid = !!`${file.name}`.match(/\.csv$/gi);

  if (!isValid)
    return res.status(403).send("Only CSV files are accepted for now.");

  const s3Res = await uploadFileToS3(file);
  const result = await processFile(file);

  return res.status(200).json({
    message: "File Processed",
    url: s3Res.Location,
    file: result,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Listening on ${PORT}`);
});
