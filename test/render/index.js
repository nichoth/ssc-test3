// @ts-check
'use strict'

const { test } = require('tapzero')
const Harness = require('../../harness')

let harness
test('create harness', async t => {
  harness = await Harness.create()
})

test('app container', async t => {
  const container = harness.container
  t.ok(container, 'the container exists')
  t.ok(document.body.contains(container), 'AppContainer is in the body')

  const sendInput = container.querySelector('#send input')
  t.ok(sendInput, 'the send <input> exists')

  sendInput.value = 'hello'
  sendInput.dispatchEvent(new Event('input', { bubbles: true }))

  await sleep(250)

  const receiveElem = container.querySelector('#response')
  t.equal(receiveElem.value, 'hello', 'a response was received over IPC')
})

test('all done', () => {
  harness.close()
})

async function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
