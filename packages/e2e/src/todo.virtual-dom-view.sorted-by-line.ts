import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.sorted-by-line'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: [
        'const first = 1',
        '// TODO earlier task',
        'const second = 2',
        '// TODO later task',
      ].join('\n'),
      path: 'main.ts',
    },
  ])

  const items = api.Locator('.TodoItem')
  await api.expect(items).toHaveCount(2)
  await api.expect(items.nth(0)).toContainText('earlier task')
  await api.expect(items.nth(0)).toContainText('Line 2')
  await api.expect(items.nth(1)).toContainText('later task')
  await api.expect(items.nth(1)).toContainText('Line 4')
}
