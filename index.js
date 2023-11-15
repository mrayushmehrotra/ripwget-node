const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { parse } = require("content-disposition");
const read_line = require("readline-sync");

async function downloadFile(url, outputDirectory) {
  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    const contentDisposition = response.headers["content-disposition"];
    const fileName = parse(contentDisposition).parameters.filename;

    const outputFilePath = path.join(outputDirectory, fileName);
    const writer = fs.createWriteStream(outputFilePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    throw error;
  }
}

function getUserInput() {
  return String(read_line.question("Enter The Url to Download: "));
}

// Example usage
const downloadUrl = getUserInput();
const outputDirectory = __dirname;

downloadFile(downloadUrl, outputDirectory)
  .then(() => {
    console.log("Download complete.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Export the getUserInput function for testing purposes
module.exports = { getUserInput };
