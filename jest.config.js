const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  testMatch: ['<rootDir>/__tests__/**/*.(test|spec).(ts|tsx)'],

  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: '<rootDir>/'
    }),
    '\\.(css|less|scss|sass)$': 'jest-css-modules-transform'
  },

  coverageProvider: 'v8'
};
