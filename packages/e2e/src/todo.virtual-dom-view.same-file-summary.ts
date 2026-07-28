import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.same-file-summary'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: '// TODO first task\n// FIXME second task',
      path: 'main.ts',
    },
  ])

  await api.expect(api.Locator('.TodoItem')).toHaveCount(2)
  await api.expect(api.Locator('.TodoSummary')).toHaveText('2 todos in 1 file.')
}
