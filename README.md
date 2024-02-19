# Bun VSCode Extension Template

A Bun template that contains the scaffolding for a VSCode extension.

## Features

- bun integration
- typescript support
- jest support for testing
- running your extension via a VSCode launch config (i.e. using `F5`)
- placeholder extension metatdata in `package.json`

## Getting Started

1. `bun create lalunamel/bun-vscode-extension my-extension`
2. `cd my-extension`
3. `code .`
4. Modify `package.json` with your information
5. Modify `LICENSE.txt` with the current year and your name
6. Start recording your work in `CHANGELOG.md`

## How this template works

### Files and folders

- `.vscode` - contains the config for vscode
  - `launch.json` - contains the config that enables running the extension with `F5`
  - `tasks.json` - contains the config that defines the default build task, used in `launch.json`
- `dist` - contains the transpiled source files
  - `extension.cjs` - the transpiled version of `src/extension.ts`. Uses `cjs` extension to conform to CommonJS (which is required for VSCode extensions)
- `mocks` - for testing. Contains mocked versions of libraries
  - `vscode.ts` - the mocked out version of the vscode library. I'm not quite sure what the structure of the normal library is, but I had a hell of a time getting it to work with bun and bun test. I think just the types are published, but the source code isn't, and then when your extension is built and bundled, the actual implementation of all the api calls used in your extension live within vscode itself. Quite complex, quite annoying. I'm sure I'm missing something and there's a better way but :shrug:
- `scripts`
  - `build-with-esbuild.ts` - contains the logic to build the app with esbuild. Since esbuild does not use config files like the rest of the bundlers, this is the way to move all of that config into a file somewhere other than `package.json`. In order to get around the annoyances with the `vscode` package not actually existing, the `vscode` package is marked as "external" (and therefore not required to be resolvable).
  - `esbuild.config.ts` - contains the config for esbuild.
  - `watch-with-esbuild.ts` - same as the build script, but runs in continuous watch mode.
- `src` - contains the source files
  - `extension.ts` - the extension file.
  - `extension.test.ts` - the test for the extension

### Developing

The extension is located at `src/extension.ts`.

The template's `package.json` already has all the options configured to create a "Hello World" extension.

### Testing

Write your tests at `src/extension.test.ts`

The tests there are unit tests, which is to say that all the dependencies of the subject under test are mocked out. They are mocked out by two means:

1. `spyOn` from bun's testing package
2. `mocks/vscode.ts`

The first is normal spying/mocking as you'd find in any other test.

When writing tests for your extension, you must mock out any aspect of the `vscode` package you're using in `mocks/vscode.ts` so that those aspects are available to your implementation when the test runs.

The second is required because the `vscode` package doesn't actually contain any implementation - only types (see notes on `build-with-esbuild.ts`). The `mocks` folder is hooked up by the `paths.vscode` value in `tsconfig.json` so that when you `import * as vscode from "vscode"`, rather than looking in `node_modules` for `vscode`, the resolver looks in `./mocks/vscode.ts`.

The mocks are only used when running tests and not when building to `./dist`. That is because `vscode` is marked as "external` in the esbuild config.

This second part is required so that when running tests, `import * as vscode from "vscode"` in the implementation file actually returns something (the something it returns is determined by the contents of `./mocks/vscode.ts`).

### Running

To run the extension, simply press `F5` or go to `Run and Debug > Run Extension`. A new VSCode instance will be started and your extension will be loaded in there. You can `console.log` and set breakpoints, too!

Once the VSCode instance has loaded the extension, open the command pallette with `Cmd + Shift + P` and type `hello world` to find the command added by the extension.

### Packaging

Packaging a VSCode extension means turning it all into a single `.vsix` file that can be installed manually by `Right Click > Install extension VSIX` in VSCode.

To package your extension, `bun run package`.

## Differences with the stock Yeoman generator

- This template does not use mocha as described in the [VSCode - Testing Extensions](https://code.visualstudio.com/api/working-with-extensions/testing-extension) docs
- It also does not use `vscode-test` like the [Yeoman generator](https://code.visualstudio.com/api/get-started/your-first-extension) does
- It uses `esbuild` rather than webpack

I generally found that the Yeoman template uses older technologies like mocha and webpack that don't play well with newer tooling, and so I did my best to replicate and update the functionality present in the Yeoman generator.

## Possible errors

```
Activating extension 'undefined_publisher.bun-vscode-extension' failed: require() of ES Module dist/extension.js from /Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/loader.js not supported. extension.js is treated as an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which declares all .js files in that package scope as ES modules. Instead rename extension.js to end in .cjs, change the requiring code to use dynamic import() which is available in all CommonJS modules, or change "type": "module" to "type": "commonjs" in package.json to treat all .js files as CommonJS (using .mjs for all ES modules instead).
```

This error is produced because VSCode can't load your extension. This is probably happening because the file you're tyring to load is using ESM instead of CommonJS. You can fix this by fiddling with the settings in `build-with-esbuild.ts`.
