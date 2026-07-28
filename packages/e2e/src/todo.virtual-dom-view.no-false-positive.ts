import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.no-false-positive'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    {
      content: [
        'const TODO = "identifier"',
        'const url = "https://example.com/TODO"',
        'TODO is plain text',
      ].join('\n'),
      path: 'main.ts',
    },
  ])

  await api
    .expect(api.Locator('.TodoMessage'))
    .toHaveText('No todo comments found.')
}
