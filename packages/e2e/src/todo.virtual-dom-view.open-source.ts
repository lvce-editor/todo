import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.open-source'

export const test: Test = async (api) => {
  const content = [
    'export const first = 1',
    'export const second = 2',
    '  // TODO open this task',
  ].join('\n')
  await createTodoWorkspaceAndShow(api, [{ content, path: 'src/main.ts' }])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click
  await item.click()

  await api.Command.execute('Timeout.sleep', 200)
  await api.Editor.shouldHaveText(content)
  await api.Editor.shouldHaveSelections(new Uint32Array([2, 5, 2, 5]))
}
