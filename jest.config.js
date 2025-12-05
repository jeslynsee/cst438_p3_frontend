// jest.config.js
module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  setupFiles: ["./jest.setup.js"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/playwright-tests/",
  ],
};
