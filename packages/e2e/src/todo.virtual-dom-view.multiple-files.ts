import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.multiple-files'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '# FIXME repair configuration', path: 'config.py' },
    { content: 'const value = 1\n// TODO add validation', path: 'src/main.ts' },
  ])

  const items = api.Locator('.TodoItem')
  await api.expect(items).toHaveCount(2)
  await api.expect(items.nth(0)).toContainText('config.py')
  await api.expect(items.nth(1)).toContainText('src/main.ts')
  await api
    .expect(api.Locator('.TodoSummary'))
    .toHaveText('2 todos in 2 files.')
}
