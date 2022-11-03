// @ts-check
'use strict'

import stringify from 'json-stringify-safe'
const system = window.system
import sleep from './sleep'

export class Harness {
  static async create () {
    const harness = new Harness()
    await harness.bootstrap()
    return harness
  }

  constructor () {
    this.container = null
  }

  async bootstrap () {
    console.log('ccccccccccc')
    Harness.PatchConsole()
    console.log('ddddddddddddd')

    /**
     * AppContainer is the appContainer component created by the app process
     * and assigned to window
     */
    const AppContainer = Reflect.get(window, 'TEST_AppContainer')
    this.container = AppContainer
    // this.container.id = 'app-container'

    // document.body.appendChild(this.container)

    /**
     * Wait for an async render() to hopefully complete.
     */
    await sleep(1)
  }

  static PatchConsole () {
    console.log('eeeeeeeeeeeeee')
    // eslint-disable-next-line
    console.log = (...args) => {
      system.send({
        api: 'ssc-node',
        method: 'testConsole',
        arguments: [{
          args: stringify(args)
        }]
      })
    }

    console.log('fffffffffffffff')

    window.addEventListener('error', handleWindowError)
    window.addEventListener('unhandledrejection', handleWindowUnhandled)
  }

  close () {
    if (this.container && document.body.contains(this.container)) {
      document.body.removeChild(this.container)
    }

    this.container = null
  }
}

/**
 * @param {ErrorEvent} event
 */
function handleWindowError (event) {
  const err = {
    message: (event.error || event).message,
    stack: (event.error || event).stack
  }

  system.send({
    api: 'ssc-node',
    method: 'testUncaught',
    arguments: [{
      err: err,
      type: 'error'
    }]
  })
}

/**
 * @param {PromiseRejectionEvent} event
 */
function handleWindowUnhandled (event) {
  const err = {
    message: event.reason.message || event.reason,
    stack: event.reason.stack
  }

  system.send({
    api: 'ssc-node',
    method: 'testUncaught',
    arguments: [{
      err: err,
      type: 'unhandledrejection'
    }]
  })
}
