import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.inline-comment'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: 'const value = 1 // TODO handle the inline case',
      path: 'main.ts',
    },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('handle the inline case')
  await api.expect(item).toContainText('Line 1')
}
