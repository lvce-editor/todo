import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.js'

export const name = 'todo.virtual-dom-view.markdown-heading-ignored'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '# TODO release checklist', path: 'README.md' },
  ])

  await api
    .expect(api.Locator('.TodoMessage'))
    .toHaveText('No todo comments found.')
  await api.expect(api.Locator('.TodoItem')).toHaveCount(0)
}
