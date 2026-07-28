import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.unfinished-owner'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO(alice', path: 'main.ts' },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('(alice')
  await api
    .expect(item)
    .toHaveAttribute('aria-label', 'TODO: (alice, main.ts, line 1')
}
