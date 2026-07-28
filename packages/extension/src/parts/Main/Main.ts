import {
  activate as activateExtensionApi,
  executeCommand,
  registerCommand,
  registerFileChangeHandler,
  registerView,
} from '@lvce-editor/api'
import { viewId } from '../Constants/Constants.ts'
import { refreshActiveTodoViewInstances } from '../CreateInstance/CreateInstance.ts'
import * as TodoView from '../TodoView/TodoView.ts'

export interface MainDependencies {
  readonly activateExtensionApi: typeof activateExtensionApi
  readonly executeCommand: typeof executeCommand
  readonly registerCommand: typeof registerCommand
  readonly registerFileChangeHandler: typeof registerFileChangeHandler
  readonly registerView: typeof registerView
}

const defaultDependencies: MainDependencies = {
  activateExtensionApi,
  executeCommand,
  registerCommand,
  registerFileChangeHandler,
  registerView,
}

const state = {
  activated: false,
}

export const activate = async (
  dependencies: Readonly<MainDependencies> = defaultDependencies,
): Promise<void> => {
  const { activated } = state
  if (activated) {
    return
  }
  state.activated = true
  await dependencies.activateExtensionApi()
  dependencies.registerFileChangeHandler(refreshActiveTodoViewInstances)
  dependencies.registerView(TodoView.view)
  dependencies.registerCommand({
    execute() {
      return dependencies.executeCommand('Layout.toggleSideBarView', viewId)
    },
    id: 'todo.show',
  })
}

export const deactivate = (): void => {}
