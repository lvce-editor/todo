import { expect, jest, test } from '@jest/globals'
import { openTodo } from '../src/parts/OpenTodo/OpenTodo.ts'

test('opens the source and moves the cursor to the todo', async () => {
  const openUri = jest.fn<(uri: string) => Promise<void>>().mockResolvedValue()
  const setCursor = jest
    .fn<(rowIndex: number, columnIndex: number) => Promise<void>>()
    .mockResolvedValue()

  await openTodo(
    {
      column: 7,
      line: 12,
      path: 'src/main.ts',
      tag: 'TODO',
      text: 'finish',
      uri: '/workspace/src/main.ts',
    },
    { openUri, setCursor },
  )

  expect(openUri).toHaveBeenCalledWith('/workspace/src/main.ts')
  expect(setCursor).toHaveBeenCalledWith(11, 6)
})
