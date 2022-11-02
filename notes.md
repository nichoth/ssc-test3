# notes

`ssc.config` specifies `node build.js` as a build script.

In `build.js`, you can see it building a file, `test.js`:

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

within `src/render/index.js`, see a function `loadTest`:

```js
function loadTest (AppContainer) {
  //
  // We have two bundles, src & test. to avoid duplicate classes
  // shared between two bundles, expose important things as global
  // variables.
  //
  Reflect.set(window, 'TEST_AppContainer', AppContainer)
  Reflect.set(window, 'TEST_Tonic', Tonic)

  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', 'test.js')

  document.body.appendChild(script)
}
```

what this function does is add a script link that points to the test file that we built in the `ssc.config` build process.

We check if you passed in `--test` when running the app, and if so, we run `loadTest`.



