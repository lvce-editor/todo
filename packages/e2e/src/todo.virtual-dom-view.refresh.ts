import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.refresh'

export const test: Test = async (api) => {
  const tmpDir = await createTodoWorkspaceAndShow(api, [
    { content: 'export const value = 1', path: 'main.ts' },
  ])
  await api
    .expect(api.Locator('.TodoMessage'))
    .toHaveText('No todo comments found.')

  await api.FileSystem.writeFile(
    `${tmpDir}/main.ts`,
    'export const value = 1\n// TODO refreshed item',
  )
  const refreshButton = api.Locator(
    'button.IconButton[data-command="todo.refresh"]',
  )
  await api.expect(refreshButton).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click
  await refreshButton.click()
  await api.Command.execute('Timeout.sleep', 200)

  const item = api.Locator('.TodoItem')
  await api.expect(item).toBeVisible()
  await api.expect(item).toContainText('refreshed item')
  await api.expect(item).toContainText('Line 2')
}
