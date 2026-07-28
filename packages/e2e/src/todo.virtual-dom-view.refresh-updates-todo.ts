import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.refresh-updates-todo'

export const test: Test = async (api) => {
  const tmpDir = await createTodoWorkspaceAndShow(api, [
    { content: '// TODO original text', path: 'main.ts' },
  ])
  await api.expect(api.Locator('.TodoItem')).toContainText('original text')

  await api.FileSystem.writeFile(
    `${tmpDir}/main.ts`,
    '// TODO updated text after refresh',
  )
  await api.Command.executeExtensionCommand('todo.refresh')

  const item = api.Locator('.TodoItem')
  await api.expect(item).toHaveCount(1)
  await api.expect(item).toContainText('updated text after refresh')
}
