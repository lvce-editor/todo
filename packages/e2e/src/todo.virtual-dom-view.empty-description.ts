import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.empty-description'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO', path: 'main.ts' },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('No description')
  await api
    .expect(item)
    .toHaveAttribute('aria-label', 'TODO: No description, main.ts, line 1')
}
