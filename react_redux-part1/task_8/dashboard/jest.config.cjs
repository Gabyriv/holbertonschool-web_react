/**
 * Jest configuration for the dashboard application
 */
module.exports = {
  // Use jsdom for testing React components
  testEnvironment: 'jsdom',
  
  // Module name mapping for imports
  moduleNameMapper: {
    // Mock axios with jest-mock-axios
    '^axios$': 'jest-mock-axios',
    // Mock image imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/fileTransformer.js',
    // Mock CSS imports
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  
  // Setup files to run after the test framework is installed
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  
  // Transform files using babel-jest
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // File extensions to consider
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

