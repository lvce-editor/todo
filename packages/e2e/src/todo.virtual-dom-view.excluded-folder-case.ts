import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.excluded-folder-case'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '// TODO visible', path: 'src/main.ts' },
    {
      content: '// TODO hidden dependency',
      path: 'NODE_MODULES/pkg/index.js',
    },
    { content: '// TODO hidden output', path: 'DIST/bundle.js' },
  ])

  const items = api.Locator('.TodoItem')
  await api.expect(items).toHaveCount(1)
  await api.expect(items).toContainText('visible')
}
