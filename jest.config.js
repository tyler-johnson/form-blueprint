module.exports = {
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest"
  },
  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json"
    }
  },
  testMatch: [
    "**/__tests__/*.+(ts|tsx|js)"
  ]
};
