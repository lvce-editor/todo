import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.block-continuation'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: ['/*', ' * TODO document the public api', ' */'].join('\n'),
      path: 'main.ts',
    },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('document the public api')
  await api.expect(item).toContainText('Line 2')
}
