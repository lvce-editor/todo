import {
  activate as activateExtensionApi,
  executeCommand,
  registerCommand,
  registerView,
} from '@lvce-editor/api'
import { viewId } from '../Constants/Constants.ts'
import { refreshActiveTodoViewInstances } from '../CreateInstance/CreateInstance.ts'
import * as TodoView from '../TodoView/TodoView.ts'

const state = {
  activated: false,
}

export const activate = async (): Promise<void> => {
  const { activated } = state
  if (activated) {
    return
  }
  state.activated = true
  await activateExtensionApi()
  registerView(TodoView.view)
  registerCommand({
    execute() {
      return executeCommand('Layout.toggleSideBarView', viewId)
    },
    id: 'todo.show',
  })
  registerCommand({
    execute() {
      return refreshActiveTodoViewInstances()
    },
    id: 'todo.refresh',
  })
}

export const deactivate = (): void => {}
