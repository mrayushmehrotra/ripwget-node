const { expect } = require("chai");
const { getUserInput } = require("../index"); // Replace 'yourFileName' with the actual filename of your code file.

describe("getUserInput", function () {
  it("should return a string", function () {
    // Mock user input
    const mockInput = "https://example.com/path/to/download/file.zip";

    // Replace the actual readline-sync implementation with a function that returns the mock input
    const originalReadlineSync = require("readline-sync");
    originalReadlineSync.question = () => mockInput;

    const userInput = getUserInput();

    // Reset readline-sync to its original state
    originalReadlineSync.question = originalReadlineSync.question;

    expect(userInput).to.equal(mockInput);
  });
});
