import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.excluded-folders'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO visible', path: 'src/main.ts' },
    { content: '// TODO hidden dependency', path: 'node_modules/pkg/index.js' },
    { content: '// TODO hidden git data', path: '.git/hooks/sample' },
    { content: '// TODO hidden build output', path: 'dist/bundle.js' },
    { content: '// TODO hidden coverage', path: 'coverage/report.js' },
  ])

  const items = api.Locator('.TodoItem')
  await api.expect(items).toHaveCount(1)
  await api.expect(items).toContainText('visible')
}
