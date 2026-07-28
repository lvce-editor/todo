import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.sql-comment'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: 'SELECT 1 -- FIXME handle the empty row',
      path: 'query.sql',
    },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('FIXME')
  await api.expect(item).toContainText('handle the empty row')
}
