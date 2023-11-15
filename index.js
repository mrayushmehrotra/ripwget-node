const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { parse } = require("content-disposition");
const read_line = require("readline-sync");
const ProgressBar = require("progress");

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

    const totalSize = parseInt(response.headers["content-length"], 10);
    let downloadedSize = 0;

    // Create a progress bar
    const progressBar = new ProgressBar("Downloading [:bar] :percent :etas", {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: totalSize,
    });

    // Update the progress bar as data is received
    response.data.on("data", (chunk) => {
      downloadedSize += chunk.length;
      progressBar.tick(chunk.length);
    });

    // Pipe the response stream to the file
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        progressBar.terminate(); // Complete the progress bar
        resolve();
      });
      writer.on("error", (err) => {
        progressBar.terminate(); // Terminate the progress bar on error
        reject(err);
      });
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
