import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.owner'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO(alice): review ownership', path: 'main.ts' },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('review ownership')
  await api
    .expect(item)
    .toHaveAttribute('aria-label', 'TODO: review ownership, main.ts, line 1')
}
