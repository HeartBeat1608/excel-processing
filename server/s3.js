const path = require("path");
const AWS = require("aws-sdk");

const AWS_ACCESS_KEY = "AKIAQT2O4P72FGCO3IE5";
const AWS_SECRET_ACCESS_KEY = "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";
const BUCKET = "testexcelupload";

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const uploadFileToS3 = (file) => {
  const { name, data } = file;

  const params = {
    Bucket: BUCKET, // pass your bucket name
    Key: `${path.extname(name)}_${new Date()
      .toLocaleString("en-IN", { timeStyle: "medium", dateStyle: "short" })
      .split(" ")
      .join("_")}.csv`, // file will be saved as testexcelupload/{filename}_{date/time}.csv
    Body: data,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (s3Err, s3Data) {
      if (s3Err) reject(s3Err);
      // console.log(`File uploaded successfully at ${s3Data.Location}`);
      resolve(s3Data);
    });
  });
};

module.exports = {
  uploadFileToS3,
};
