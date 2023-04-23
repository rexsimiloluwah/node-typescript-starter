/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  setupFiles: ["./src/setup-test.ts"],
  clearMocks: true,
  restoreMocks: true, 
  resetMocks: true
};
