import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  collectCoverageFrom: [
    'src/**/*.{[jt]s,[jt]sx}',
    '!**/node_modules/**',
    '!src/graphql/*/resolver.ts',
    '!src/graphql/auth/checker.ts'
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "src/pages/_app.tsx",
    "src/pages/_document.tsx",
    "src/graphql/order/schema.ts",
    "src/views/components/Order/"
  ],
  testMatch: [
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 24,
      "functions": 40,
      "lines": 40,
      "statements": 40
    }
  }
}

export default createJestConfig(customJestConfig)
