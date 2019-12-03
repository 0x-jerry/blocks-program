module.exports = {
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['src/*/src/**/*.ts'],
  watchPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'js'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/src/**/__tests__/**/*spec.ts']
}
