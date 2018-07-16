module.exports = {
  // modulePathIgnorePatterns: [
  //   "<rootDir>/tool/pkggen/template/",
  //   "/.template/.*"
  // ],
  // testPathIgnorePatterns: [
  //   "/_utils/.*"
  // ],
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
