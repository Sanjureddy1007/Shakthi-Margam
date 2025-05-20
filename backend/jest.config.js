module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/scripts/**',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageReporters: ['text', 'lcov', 'clover'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testTimeout: 10000
};
