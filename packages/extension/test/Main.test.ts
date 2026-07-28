import { expect, jest, test } from '@jest/globals'

const activateExtensionApi = jest.fn(async () => {})
const executeCommand = jest.fn(async (..._args: unknown[]) => {})
const registerCommand = jest.fn()
const registerView = jest.fn()

jest.unstable_mockModule('@lvce-editor/api', () => ({
  activate: activateExtensionApi,
  executeCommand,
  getWorkspaceUri: jest.fn(),
  openUri: jest.fn(),
  readDirWithFileTypes: jest.fn(),
  readFile: jest.fn(),
  registerCommand,
  registerView,
}))

const { activate } = await import('../src/parts/Main/Main.ts')
const { view } = await import('../src/parts/TodoView/TodoView.ts')

test('registers refresh only as a view command', async () => {
  await activate()
  await activate()

  expect(activateExtensionApi).toHaveBeenCalledTimes(1)
  expect(registerView).toHaveBeenCalledTimes(1)
  expect(registerView).toHaveBeenCalledWith(view)
  expect(registerCommand).toHaveBeenCalledTimes(1)
  expect(registerCommand).toHaveBeenCalledWith({
    execute: expect.any(Function),
    id: 'todo.show',
  })

  const command = registerCommand.mock.calls[0][0] as {
    readonly execute: () => Promise<void>
  }
  await command.execute()
  expect(executeCommand).toHaveBeenCalledWith(
    'Layout.toggleSideBarView',
    'todo.views.todos',
  )
})
