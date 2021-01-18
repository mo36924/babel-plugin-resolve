import { resolve } from "path";
import { transformAsync } from "@babel/core";
import { describe, expect, test } from "@jest/globals";
import plugin, { Options } from "./index";

const transform = (code: string, options: Options = {}) =>
  transformAsync(code, {
    babelrc: false,
    configFile: false,
    filename: resolve("index.mjs"),
    plugins: [[plugin, options]],
  });

describe("babel-plugin-resolve", () => {
  test("bare import", async () => {
    const result = await transform(`import babel from "@babel/core"`);
    expect(result).toMatchInlineSnapshot(`import babel from "./node_modules/@babel/core/lib/index.js";`);
  });

  test("builtin module", async () => {
    const result = await transform(`import path from "buffer"`, { ignoreBuiltins: true });
    expect(result).toMatchInlineSnapshot(`import path from "buffer";`);
  });

  test("export", async () => {
    const result = await transform(`export { createElement } from "@babel/core"`);
    expect(result).toMatchInlineSnapshot(`export { createElement } from "./node_modules/@babel/core/lib/index.js";`);
  });
});
