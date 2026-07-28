import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.accessibility'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO: keyboard friendly', path: 'main.ts' },
  ])

  const list = api.Locator('.TodoList')
  await api.expect(list).toHaveAttribute('aria-label', 'Todo comments')
  const item = api.Locator('.TodoItem')
  await api
    .expect(item)
    .toHaveAttribute('aria-label', 'TODO: keyboard friendly, main.ts, line 1')
  await api.expect(item).toHaveAttribute('title', 'main.ts:1:4')
}
