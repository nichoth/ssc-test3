// @ts-check
'use strict'

import { test } from 'tapzero'
import TestCommon from '../../harness'

test('example fail', async t => {
  await TestCommon.create()
  t.fail('example fail')
})
