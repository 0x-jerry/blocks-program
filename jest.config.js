module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['src/**/*.ts'],
  watchPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'js'],
  rootDir: __dirname,
  moduleNameMapper: {
    '^@/(.*?)$': '<rootDir>/src/$1'
  },
  testMatch: ['<rootDir>/src/**/__tests__/**/*.spec.ts']
}
