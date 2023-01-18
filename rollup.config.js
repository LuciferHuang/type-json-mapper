import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import size from "rollup-plugin-sizes";
import esbuild from "rollup-plugin-esbuild";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default [
  {
    input: `src/index.ts`,
    output: {
      name: `TYPE_JSON_MAPPER`,
      file: "dist/index.umd.js",
      format: "umd",
      footer: "/* follow me on Github! @LuciferHuang */",
    },
    plugins: [
      esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        minify: process.env.NODE_ENV === "production",
        target: "es2015",
        jsx: "transform",
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
        define: {
          __VERSION__: '"x,y,z"',
        },
        tsconfig: "tsconfig.json",
        loaders: {
          ".json": "json",
          ".js": "jsx",
        },
      }),
      resolve(),
      commonjs(),
      nodePolyfills(),
      json(),
      size(),
      terser(),
    ],
  },
];
