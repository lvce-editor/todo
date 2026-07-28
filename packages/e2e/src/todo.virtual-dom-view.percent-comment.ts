import type { Test } from '@lvce-editor/test-with-playwright'
import { createTodoWorkspaceAndShow } from './_todo.virtual-dom-view.shared.ts'

export const name = 'todo.virtual-dom-view.percent-comment'

export const test: Test = async (api) => {
  await createTodoWorkspaceAndShow(api, [
    { content: '% HACK replace this workaround', path: 'script.m' },
  ])

  const item = api.Locator('.TodoItem')
  await api.expect(item).toContainText('HACK')
  await api.expect(item).toContainText('replace this workaround')
}
