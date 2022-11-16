module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/dist/'],
  setupFilesAfterEnv: ['jest-extended'],
};
