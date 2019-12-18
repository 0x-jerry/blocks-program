module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      babelConfig: '.babelrc'
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['src/**/*.ts', '!**/index.ts', '!**/__tests__/*'],
  watchPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'js'],
  rootDir: __dirname,
  moduleNameMapper: {
    '^@/(.*?)$': '<rootDir>/src/$1'
  },
  testMatch: ['<rootDir>/src/**/__tests__/**/*.spec.ts']
}
