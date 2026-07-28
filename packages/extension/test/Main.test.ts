import { expect, jest, test } from '@jest/globals'
import { refreshActiveTodoViewInstances } from '../src/parts/CreateInstance/CreateInstance.ts'
import {
  activate,
  deactivate,
  type MainDependencies,
} from '../src/parts/Main/Main.ts'
import { view } from '../src/parts/TodoView/TodoView.ts'

test('registers a file change handler and the view command', async () => {
  const activateExtensionApi = jest.fn<
    MainDependencies['activateExtensionApi']
  >(async () => {})
  const executeCommand = jest.fn<MainDependencies['executeCommand']>(
    async () => {},
  )
  const registerCommand = jest.fn<MainDependencies['registerCommand']>(() => ({
    dispose(): void {},
  }))
  const registerFileChangeHandler = jest.fn<
    MainDependencies['registerFileChangeHandler']
  >(() => ({
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
    registerFileChangeHandler,
    registerView,
  }

  await activate(dependencies)
  await activate(dependencies)

  expect(activateExtensionApi).toHaveBeenCalledTimes(1)
  expect(registerViewMock).toHaveBeenCalledTimes(1)
  expect(registerViewMock).toHaveBeenCalledWith(view)
  expect(registerFileChangeHandler).toHaveBeenCalledTimes(1)
  expect(registerFileChangeHandler).toHaveBeenCalledWith(
    refreshActiveTodoViewInstances,
  )
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

test('exports the extension lifecycle entrypoint', async () => {
  const extension = await import('../src/todoMain.ts')

  expect(extension.activate).toBe(activate)
  expect(extension.deactivate).toBe(deactivate)
  expect(deactivate()).toBeUndefined()
})
