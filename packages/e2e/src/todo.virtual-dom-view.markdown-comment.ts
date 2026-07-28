import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.markdown-comment'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: '# Project\n<!-- TODO: improve the readme -->',
      path: 'README.md',
    },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('improve the readme')
  await api.expect(item).toContainText('Line 2')
}
