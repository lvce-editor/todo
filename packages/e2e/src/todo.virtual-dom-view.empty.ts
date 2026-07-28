import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.empty'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: 'export const value = 1', path: 'main.ts' },
  ])

  const message = api.Locator('.TodoMessage')
  await api.expect(message).toBeVisible()
  await api.expect(message).toHaveText('No todo comments found.')
  await api.expect(api.Locator('.TodoItem')).toHaveCount(0)
}
