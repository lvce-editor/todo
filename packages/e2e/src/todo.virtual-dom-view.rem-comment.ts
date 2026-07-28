import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.rem-comment'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: 'REM TODO support windows scripts', path: 'build.cmd' },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('TODO')
  await api.expect(item).toContainText('support windows scripts')
}
