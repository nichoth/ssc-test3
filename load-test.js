function loadTest (appContainer) {
  const isTest = process.argv.some(item => item.includes('--test'))

  if (!isTest) return false

  //
  // We have two bundles, src & test. to avoid duplicate classes
  // shared between two bundles, expose important things as global
  // variables.
  //

  Reflect.set(window, 'TEST_AppContainer', appContainer)

  // add a script tag to the html
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', 'test.js')

  document.body.appendChild(script)

  return true
}

module.exports = loadTest
