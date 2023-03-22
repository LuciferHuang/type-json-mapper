module.exports = {
  roots: ["<rootDir>/tests"],
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
}