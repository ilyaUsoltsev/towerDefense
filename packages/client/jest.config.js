const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT || '3001',
    __EXTERNAL_SERVER_URL__: process.env.EXTERNAL_SERVER_URL || 'http://localhost:3001',
    __INTERNAL_SERVER_URL__: process.env.INTERNAL_SERVER_URL || 'http://localhost:3001',
  },
}
