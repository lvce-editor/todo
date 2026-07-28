import {
  AriaRoles,
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { TodoViewState } from '../TodoViewState/TodoViewState.ts'
import { renderMessage } from '../RenderMessage/RenderMessage.ts'
import { renderTodo } from '../RenderTodo/RenderTodo.ts'

interface TodoContent {
  readonly childCount: number
  readonly dom: readonly VirtualDomNode[]
}

const todoSummaryNode: VirtualDomNode = {
  childCount: 1,
  className: 'TodoSummary',
  type: VirtualDomElements.Div,
}

export const renderTodoContent = (
  state: Readonly<TodoViewState>,
): TodoContent => {
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
      todoSummaryNode,
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
