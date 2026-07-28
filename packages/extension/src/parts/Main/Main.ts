import {
  activate as activateExtensionApi,
  executeCommand,
  registerCommand,
  registerView,
} from '@lvce-editor/api'
import { viewId } from '../Constants/Constants.ts'
import * as TodoView from '../TodoView/TodoView.ts'

const state = {
  activated: false,
}

export const activate = async (): Promise<void> => {
  if (state.activated) {
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
}

export const deactivate = (): void => {}
