import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import esbuild from "rollup-plugin-esbuild"
import dts from "rollup-plugin-dts"
import packageJson from "./package.json" assert {type: "json"}

const name = packageJson.main.replace(/\.[cm]?js$/, "")

const bundle = config => ({
  input: "src/index.ts",
  external: id => id === "pako",
  ...config,
})

export default [
  bundle({
    plugins: [resolve(), esbuild()],
    output: [
      {
        file: `${name}.cjs`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [resolve(), esbuild()],
    external: () => false,
    output: [
      {
        file: `${name}.bundle.js`,
        name: "KaitaiStream",
        format: "iife",
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
]
