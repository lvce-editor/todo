import { expect, test } from '@jest/globals'
import { getErrorMessage } from '../src/parts/GetErrorMessage/GetErrorMessage.ts'

test('gets messages from errors and other values', () => {
  expect(getErrorMessage(new Error('failed'))).toBe('failed')
  expect(getErrorMessage('failed')).toBe('failed')
})
