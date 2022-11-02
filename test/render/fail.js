// @ts-check
'use strict'

const { test } = require('tapzero')
const TestCommon = require('../../harness.js')

test('example fail', async t => {
  await TestCommon.create()
  t.fail('example fail')
})
