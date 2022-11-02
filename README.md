# socket test

How do I test the application I'm making?

There are **two key elements** -- the path you choose for building the tests, and the arguments you call the final application with. You must must build the tests to the right path, and you must call the compiled program with an argument,
```
--test
```

There is also `@socketsupply/-base` & `@socketsupply/-base-cli` that can build an app. This is different because it is decoupled from a build process.

## install

```
npm i -D @nichoth/socket-test
```

## Write some tests
You must build this file to the right path, and call [loadTest](#call-load-test-in-application-code) in the app code.

```js
// test/render/index.js
const { test } = require('tapzero')
const Harness = require('@nichoth/socket-test/harness')

test('app-container exists', async (t) => {
  const harness = await Harness.create()
  // `container` is whatever you passed in to `loadTest` in the
  // application code
  const container = common.container

  t.ok(container, 'the container exists')
  // ...
})
```

## call `load-test` in application code
`load-test.js` should be called in your application code

**Note that this depends on the [build step](#build-the-application-and-tests). You must build the tests with a target of path.join(target, 'test.js')**

```js
// src/render/index.js
const loadTest = require('@nichoth/socket-test/load-test')
const Tonic = require('@socketsupply/tonic')

class AppContainer extends Tonic {
    // ...
}

window.onload = () => {
  // this sets AppContainer as a global variable on `window`
  // pass in a function that returns your app container
  const isTesting = loadTest(() => (new AppContainer()))

  // don't need to attach the app in this case
  if (isTesting) return

  const app = new AppContainer()
  app.id = 'root'
  document.body.appendChild(app)
}
```

## build the application and tests
In `ssc.config`, be sure that the `build` script calls a script that will
build the tests in addition to the app.

```js
  await esbuild.build({
    entryPoints: ['test/render/index.js'],
    bundle: true,
    keepNames: true,
    // minify: true,
    outfile: path.join(target, 'test.js'),
    platform: 'browser'
  })
```


## use the tests

### cli use
The CLI is called `ssct`, which stands for "socket supply company test".

The CLI does two things -- compiles the app as defined in `ssc.config`, and
calls the compiled binary with the argument `--test`, which will run the tests. (This argument is something that `load-test.js` looks for.)

#### 1 - install this as a dev dependency
Install this as a dev dependency: `npm i -D @nichoth/socket-test`

#### 2 - call this CLI
In this example we are also using the program `tap-arc`, because our tests are written in `tap` format.

Be sure that `ssc.config` is configured correctly; the command line tool depends on it.

It will take a second to start, because we are compiling a new binary before testing.

##### example
```
npx ssct . | npx tap-arc
```

----------------------------------


## test this package
This will run this package on an example application included in this repo, in the `src` folder.

```
npm test
```

### test the CLI

```
npm run test-cli
```

This calls `/bin/cli.js` with one argument, `.`, for the current directory.


#### test the CLI with a failing exit code

This is less automated. Since this depends on the build path for the compiled test file, in `build.js`, you must change the test's build script so that it points to `test/render/fail.js` as the source:

```js
  await esbuild.build({
    entryPoints: ['test/render/fail.js'],
    bundle: true,
    keepNames: true,
    outfile: path.join(target, 'test.js'),
    platform: 'browser'
  })
```

then run `npm run test-cli`, and check the exit code of the last command: `echo $?`. It should print `1`.


## API

```js
const fs = require('fs')
const parseConfig = require('@nichoth/socket-test/parse-config)
const config = fs.readFileSync('./ssc.config')

const conf = parseConfig(config)
```
