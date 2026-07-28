import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.leading-whitespace'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '    // BUG: preserve indentation', path: 'main.ts' },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('BUG')
  await api.expect(item).toContainText('preserve indentation')
  await api.expect(item).toHaveAttribute('title', 'main.ts:1:8')
}
