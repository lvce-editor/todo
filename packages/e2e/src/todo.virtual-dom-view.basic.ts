import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.basic'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO: write documentation', path: 'main.ts' },
  ])

  const item = api.Locator('button[name="todo:0"]')
  await api.expect(item).toBeVisible()
  await api.expect(item).toContainText('TODO')
  await api.expect(item).toContainText('write documentation')
  await api.expect(item).toContainText('main.ts')
  await api.expect(item).toContainText('Line 1')
}
