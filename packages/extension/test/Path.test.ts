import { expect, test } from '@jest/globals'
import { joinPath, joinRelativePath } from '../src/parts/Path/Path.ts'

test('joins posix and windows paths', () => {
  expect(joinPath('/workspace', 'src')).toBe('/workspace/src')
  expect(joinPath('/workspace/', 'src')).toBe('/workspace/src')
  expect(joinPath('C:\\workspace', 'src')).toBe('C:\\workspace\\src')
})

test('joins uri paths and encodes names', () => {
  expect(joinPath('memfs://workspace/project', 'hello world.ts')).toBe(
    'memfs://workspace/project/hello%20world.ts',
  )
})

test('joins relative paths', () => {
  expect(joinRelativePath('', 'src')).toBe('src')
  expect(joinRelativePath('src', 'main.ts')).toBe('src/main.ts')
})
