import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.refresh-action-accessibility'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO inspect refresh action', path: 'main.ts' },
  ])

  const refreshButton = api.Locator(
    'button.IconButton[data-command="todo.refresh"]',
  )
  await api.expect(refreshButton).toBeVisible()
  await api.expect(refreshButton).toHaveAttribute('name', 'refresh')
  await api.expect(refreshButton).toHaveAttribute('title', 'Refresh Todos')
  await api.expect(refreshButton).toHaveCount(1)
}
