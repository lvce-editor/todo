import {
  activate as activateExtensionApi,
  executeCommand,
  registerCommand,
  registerView,
} from '@lvce-editor/api'
import { viewId } from '../Constants/Constants.ts'
import * as TodoView from '../TodoView/TodoView.ts'

export interface MainDependencies {
  readonly activateExtensionApi: typeof activateExtensionApi
  readonly executeCommand: typeof executeCommand
  readonly registerCommand: typeof registerCommand
  readonly registerView: typeof registerView
}

const defaultDependencies: MainDependencies = {
  activateExtensionApi,
  executeCommand,
  registerCommand,
  registerView,
}

const state = {
  activated: false,
}

export const activate = async (
  dependencies: Readonly<MainDependencies> = defaultDependencies,
): Promise<void> => {
  if (state.activated) {
    return
  }
  state.activated = true
  await dependencies.activateExtensionApi()
  dependencies.registerView(TodoView.view)
  dependencies.registerCommand({
    execute() {
      return dependencies.executeCommand('Layout.toggleSideBarView', viewId)
    },
    id: 'todo.show',
  })
}

export const deactivate = (): void => {}
