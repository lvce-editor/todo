import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.refresh'

export const test: Test = async (api) => {
  const tmpDir = await createTodoWorkspaceAndShow(api, [
    { content: '', path: 'main.ts' },
  ])
  await api
    .expect(api.Locator('.TodoMessage'))
    .toHaveText('No todo comments found.')

  await api.Main.openUri(`${tmpDir}/main.ts`)
  await api.Editor.type('// TODO refreshed item')
  await api.Main.save()

  const item = api.Locator('.TodoItem')
  await api.expect(item).toBeVisible()
  await api.expect(item).toContainText('refreshed item')
  await api.expect(item).toContainText('Line 1')
}
