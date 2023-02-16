import type {JestConfigWithTsJest} from "ts-jest"

export default {
  preset: "ts-jest/presets/default-esm", // or other ESM presets
  testEnvironment: "node",
  collectCoverage: true,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    ".": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
} satisfies JestConfigWithTsJest
