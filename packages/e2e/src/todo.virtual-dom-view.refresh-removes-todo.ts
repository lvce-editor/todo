import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.refresh-removes-todo'

export const test: Test = async (api) => {
  const tmpDir = await createTodoWorkspaceAndShow(api, [
    { content: '// TODO remove after refresh', path: 'main.ts' },
  ])
  await api.expect(api.Locator('.TodoItem')).toHaveCount(1)

  await api.FileSystem.writeFile(`${tmpDir}/main.ts`, 'export const value = 1')
  await api.Command.executeExtensionCommand('todo.refresh')

  await api.expect(api.Locator('.TodoItem')).toHaveCount(0)
  await api
    .expect(api.Locator('.TodoMessage'))
    .toHaveText('No todo comments found.')
}
