import {
  AriaRoles,
  mergeClassNames,
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { TodoItem } from '../TodoItem/TodoItem.ts'
import type { TodoViewState } from '../TodoViewState/TodoViewState.ts'

const handleClick = 'handleClick'

const renderMessage = (
  message: string,
  role: string = AriaRoles.Status,
): readonly VirtualDomNode[] => [
  {
    'aria-live': 'polite',
    childCount: 1,
    className: 'TodoMessage',
    role,
    type: VirtualDomElements.Div,
  },
  text(message),
]

const getTodoLabel = (todo: Readonly<TodoItem>): string => {
  const description = todo.text || 'No description'
  return `${todo.tag}: ${description}, ${todo.path}, line ${todo.line}`
}

const renderTodo = (
  todo: Readonly<TodoItem>,
  index: number,
): readonly VirtualDomNode[] => {
  const description = todo.text || 'No description'
  return [
    {
      childCount: 1,
      className: 'TodoListItem',
      type: VirtualDomElements.Li,
    },
    {
      'aria-label': getTodoLabel(todo),
      childCount: 2,
      className: 'TodoItem',
      name: `todo:${index}`,
      onClick: handleClick,
      title: `${todo.path}:${todo.line}:${todo.column}`,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 2,
      className: 'TodoItemMain',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: mergeClassNames('TodoTag', `TodoTag${todo.tag}`),
      type: VirtualDomElements.Span,
    },
    text(todo.tag),
    {
      childCount: 1,
      className: 'TodoText',
      type: VirtualDomElements.Span,
    },
    text(description),
    {
      childCount: 2,
      className: 'TodoLocation',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'TodoPath',
      type: VirtualDomElements.Span,
    },
    text(todo.path),
    {
      childCount: 1,
      className: 'TodoLine',
      type: VirtualDomElements.Span,
    },
    text(`Line ${todo.line}`),
  ]
}

const renderContent = (
  state: Readonly<TodoViewState>,
): Readonly<{ childCount: number; dom: readonly VirtualDomNode[] }> => {
  const { error, loading, scannedFileCount, todos, truncated, workspace } =
    state
  if (loading) {
    return {
      childCount: 1,
      dom: renderMessage('Scanning workspace for todo comments…'),
    }
  }
  if (error) {
    return {
      childCount: 1,
      dom: renderMessage(error, AriaRoles.Alert),
    }
  }
  if (!workspace) {
    return {
      childCount: 1,
      dom: renderMessage('Open a folder to find todo comments.'),
    }
  }
  if (todos.length === 0) {
    return {
      childCount: 1,
      dom: renderMessage('No todo comments found.'),
    }
  }
  const uniqueFiles = new Set(todos.map((todo) => todo.path)).size
  const suffix = truncated
    ? ` Scanned the first ${scannedFileCount} files.`
    : ''
  return {
    childCount: 2,
    dom: [
      {
        childCount: 1,
        className: 'TodoSummary',
        type: VirtualDomElements.Div,
      },
      text(
        `${todos.length} ${todos.length === 1 ? 'todo' : 'todos'} in ${uniqueFiles} ${uniqueFiles === 1 ? 'file' : 'files'}.${suffix}`,
      ),
      {
        'aria-label': 'Todo comments',
        childCount: todos.length,
        className: 'TodoList',
        type: VirtualDomElements.Ul,
      },
      ...todos.flatMap(renderTodo),
    ],
  }
}

export const renderTodoView = (
  state: Readonly<TodoViewState>,
): readonly VirtualDomNode[] => {
  const content = renderContent(state)
  return [
    {
      childCount: content.childCount,
      className: 'TodoView',
      type: VirtualDomElements.Div,
    },
    ...content.dom,
  ]
}
