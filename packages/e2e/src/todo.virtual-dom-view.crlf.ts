import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.crlf'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: 'const first = 1\r\nconst second = 2\r\n// BUG fix crlf',
      path: 'main.ts',
    },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('fix crlf')
  await api.expect(item).toContainText('Line 3')
}
