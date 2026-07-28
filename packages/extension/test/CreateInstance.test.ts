import { expect, jest, test } from '@jest/globals'
import {
  AriaRoles,
  mergeClassNames,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import {
  createInstance,
  refreshActiveTodoViewInstances,
  type TodoInstanceDependencies,
} from '../src/parts/CreateInstance/CreateInstance.ts'

const handleClick = 'handleClick'

const todo = {
  column: 4,
  line: 2,
  path: 'src/main.ts',
  tag: 'TODO',
  text: 'finish',
  uri: '/workspace/src/main.ts',
}

const createDependencies = (
  overrides: Partial<TodoInstanceDependencies> = {},
): TodoInstanceDependencies => ({
  openTodo: jest.fn(async () => {}),
  scanTodos: jest.fn(async () => ({
    scannedFileCount: 1,
    todos: [todo],
    truncated: false,
    workspace: '/workspace',
  })),
  ...overrides,
})

test('loads, renders, refreshes, and opens todos', async () => {
  const requestRerender = jest.fn(async () => {})
  const dependencies = createDependencies()
  const instance = createInstance(
    {
      requestRerender,
      showContextMenu: jest.fn(async () => {}),
      uid: 1,
      viewId: 'todo.views.todos',
    },
    dependencies,
  )

  await instance.refresh()
  await instance.handleClick('invalid')
  await instance.handleClick('todo:99')
  await instance.handleEvent?.({ type: 'focus' })
  await instance.handleEvent?.({ name: 'refresh', type: 'click' })
  await instance.handleEvent?.({ name: 'todo:0', type: 'click' })

  expect(dependencies.scanTodos).toHaveBeenCalled()
  expect(dependencies.openTodo).toHaveBeenCalledWith(todo)
  expect(instance.render()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ className: 'TodoView' }),
      expect.objectContaining({ name: 'todo:0' }),
    ]),
  )
  expect(instance.getContext()).toEqual({
    'todo.todosFocus': true,
  })
  expect(instance.renderActionsDom()).toEqual([
    {
      childCount: 1,
      className: 'Actions',
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'IconButton',
      'data-command': 'todo.refresh',
      name: 'refresh',
      onClick: handleClick,
      title: 'Refresh Todos',
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: mergeClassNames('MaskIcon', 'MaskIconRefresh'),
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
  ])
  expect(requestRerender).toHaveBeenCalled()
  instance.dispose?.()
})

test('dispose removes the instance from file change refreshes', async () => {
  const scanTodos = jest.fn(async () => ({
    scannedFileCount: 0,
    todos: [],
    truncated: false,
    workspace: '/workspace',
  }))
  const instance = createInstance(undefined, {
    openTodo: jest.fn(async () => {}),
    scanTodos,
  })
  await instance.refresh()
  scanTodos.mockClear()

  instance.dispose?.()
  await refreshActiveTodoViewInstances()

  expect(scanTodos).not.toHaveBeenCalled()
})

test('renders scan errors', async () => {
  const instance = createInstance(
    undefined,
    createDependencies({
      scanTodos: jest.fn(async () => {
        throw new Error('Access denied')
      }),
    }),
  )

  await instance.refresh()

  expect(instance.render()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        text: 'Unable to scan todo comments: Access denied',
      }),
    ]),
  )
  instance.dispose?.()
})
