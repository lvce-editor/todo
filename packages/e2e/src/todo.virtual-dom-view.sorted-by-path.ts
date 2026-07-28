import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.sorted-by-path'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO last path', path: 'z.ts' },
    { content: '// TODO first path', path: 'a.ts' },
  ])

  const items = api.Locator('.TodoItem')
  await api.expect(items).toHaveCount(2)
  await api.expect(items.nth(0)).toContainText('a.ts')
  await api.expect(items.nth(1)).toContainText('z.ts')
}
