import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.open-second-source'

export const test: Test = async (api) => {
  const content = 'const value = 1\n// TODO open the second file'
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO first file', path: 'a.ts' },
    { content, path: 'b.ts' },
  ])

  const items = api.Locator('.TodoItem')
  await api.expect(items).toHaveCount(2)
  const secondItem = api.Locator('button[name="todo:1"]')
  await api.expect(secondItem).toContainText('b.ts')
  // eslint-disable-next-line e2e/no-direct-click
  await secondItem.click()

  await api.Command.execute('Timeout.sleep', 200)
  await api.Editor.shouldHaveText(content)
  await api.Editor.shouldHaveSelections(new Uint32Array([1, 3, 1, 3]))
}
