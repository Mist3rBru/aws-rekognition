module.exports = {
  bail: true,
  roots: ['<rootDir>/__tests__'],
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['mock*']
}
