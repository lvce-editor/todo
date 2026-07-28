import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.lowercase-tag'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// fixme: normalize this tag', path: 'main.ts' },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('FIXME')
  await api.expect(item).toContainText('normalize this tag')
  await api.expect(api.Locator('.TodoTag')).toHaveClass('TodoTagFIXME')
}
