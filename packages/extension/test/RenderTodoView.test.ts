import { expect, test } from '@jest/globals'
import type { TodoViewState } from '../src/parts/TodoViewState/TodoViewState.ts'
import { renderTodoView } from '../src/parts/RenderTodoView/RenderTodoView.ts'

const createState = (
  overrides: Readonly<Partial<TodoViewState>> = {},
): TodoViewState => ({
  error: '',
  loading: false,
  scannedFileCount: 1,
  todos: [],
  truncated: false,
  workspace: '/workspace',
  ...overrides,
})

const getText = (
  dom: readonly Readonly<Record<string, unknown>>[],
): readonly string[] => {
  return dom
    .map((node) => node.text)
    .filter((value): value is string => typeof value === 'string')
}

test('renders loading, error, no-workspace, and empty states', () => {
  const loadingDom = renderTodoView(createState({ loading: true }))
  expect(getText(loadingDom)).toContain('Scanning workspace for todo comments…')
  const errorDom = renderTodoView(createState({ error: 'Permission denied' }))
  expect(getText(errorDom)).toContain('Permission denied')
  const noWorkspaceDom = renderTodoView(createState({ workspace: '' }))
  expect(getText(noWorkspaceDom)).toContain(
    'Open a folder to find todo comments.',
  )
  const emptyDom = renderTodoView(createState())
  expect(getText(emptyDom)).toContain('No todo comments found.')
})

test('renders todo items as accessible source buttons', () => {
  const dom = renderTodoView(
    createState({
      scannedFileCount: 2,
      todos: [
        {
          column: 4,
          line: 2,
          path: 'src/a.ts',
          tag: 'TODO',
          text: 'write tests',
          uri: '/workspace/src/a.ts',
        },
        {
          column: 5,
          line: 8,
          path: 'src/b.ts',
          tag: 'FIXME',
          text: '',
          uri: '/workspace/src/b.ts',
        },
      ],
    }),
  )
  const todoButtons = dom.filter(
    (node) => typeof node.name === 'string' && node.name.startsWith('todo:'),
  )

  expect(todoButtons).toHaveLength(2)
  expect(todoButtons[0]).toMatchObject({
    'aria-label': 'TODO: write tests, src/a.ts, line 2',
    name: 'todo:0',
    title: 'src/a.ts:2:4',
  })
  expect(getText(dom)).toEqual(
    expect.arrayContaining([
      '2 todos in 2 files.',
      'TODO',
      'write tests',
      'src/a.ts',
      'Line 2',
      'No description',
    ]),
  )
})

test('renders the scan limit note', () => {
  const dom = renderTodoView(
    createState({
      scannedFileCount: 10_000,
      todos: [
        {
          column: 1,
          line: 1,
          path: 'a.ts',
          tag: 'TODO',
          text: 'one',
          uri: '/a.ts',
        },
      ],
      truncated: true,
    }),
  )

  expect(getText(dom)).toContain(
    '1 todo in 1 file. Scanned the first 10000 files.',
  )
})
