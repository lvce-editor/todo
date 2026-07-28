import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.nested-files'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: '<!-- TODO: improve nested component -->',
      path: 'packages/app/src/component.html',
    },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toBeVisible()
  await api.expect(item).toContainText('packages/app/src/component.html')
  await api.expect(item).toContainText('improve nested component')
}
