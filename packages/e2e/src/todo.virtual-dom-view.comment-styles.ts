import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.comment-styles'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: [
        '// TODO javascript',
        '# FIXME python',
        '/* HACK css */',
        '<!-- BUG html -->',
        '; XXX ini',
      ].join('\n'),
      path: 'comments.txt',
    },
  ])

  const items = api.Locator('.TodoItem')
  await api.expect(items).toHaveCount(5)
  await api.expect(items.nth(0)).toContainText('TODO')
  await api.expect(items.nth(1)).toContainText('FIXME')
  await api.expect(items.nth(2)).toContainText('HACK')
  await api.expect(items.nth(3)).toContainText('BUG')
  await api.expect(items.nth(4)).toContainText('XXX')
}
