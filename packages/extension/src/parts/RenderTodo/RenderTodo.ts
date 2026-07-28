import {
  mergeClassNames,
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { TodoItem } from '../TodoItem/TodoItem.ts'
import { getTodoLabel } from '../GetTodoLabel/GetTodoLabel.ts'

const handleClick = 'handleClick'

export const renderTodo = (
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
