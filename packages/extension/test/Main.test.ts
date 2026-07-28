import { expect, jest, test } from '@jest/globals'
import { activate, type MainDependencies } from '../src/parts/Main/Main.ts'
import { view } from '../src/parts/TodoView/TodoView.ts'

test('registers refresh only as a view command', async () => {
  const activateExtensionApi = jest.fn<
    MainDependencies['activateExtensionApi']
  >(async () => {})
  const executeCommand = jest.fn<MainDependencies['executeCommand']>(
    async () => {},
  )
  const registerCommand = jest.fn<MainDependencies['registerCommand']>(() => ({
    dispose(): void {},
  }))
  const registerViewMock = jest.fn()
  const registerView: MainDependencies['registerView'] = (view) => {
    registerViewMock(view)
    return {
      dispose(): void {},
    }
  }
  const dependencies: MainDependencies = {
    activateExtensionApi,
    executeCommand,
    registerCommand,
    registerView,
  }

  await activate(dependencies)
  await activate(dependencies)

  expect(activateExtensionApi).toHaveBeenCalledTimes(1)
  expect(registerViewMock).toHaveBeenCalledTimes(1)
  expect(registerViewMock).toHaveBeenCalledWith(view)
  expect(registerCommand).toHaveBeenCalledTimes(1)
  expect(registerCommand).toHaveBeenCalledWith({
    execute: expect.any(Function),
    id: 'todo.show',
  })

  const command = registerCommand.mock.calls[0][0]
  await command.execute()
  expect(executeCommand).toHaveBeenCalledWith(
    'Layout.toggleSideBarView',
    'todo.views.todos',
  )
})
