import {
  mergeClassNames,
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { TodoItem } from '../TodoItem/TodoItem.ts'
import { getTodoLabel } from '../GetTodoLabel/GetTodoLabel.ts'

const handleClick = 'handleClick'

const todoListItemNode: VirtualDomNode = {
  childCount: 1,
  className: 'TodoListItem',
  type: VirtualDomElements.Li,
}

const todoItemMainNode: VirtualDomNode = {
  childCount: 2,
  className: 'TodoItemMain',
  type: VirtualDomElements.Div,
}

const todoTextNode: VirtualDomNode = {
  childCount: 1,
  className: 'TodoText',
  type: VirtualDomElements.Span,
}

const todoLocationNode: VirtualDomNode = {
  childCount: 2,
  className: 'TodoLocation',
  type: VirtualDomElements.Div,
}

const todoPathNode: VirtualDomNode = {
  childCount: 1,
  className: 'TodoPath',
  type: VirtualDomElements.Span,
}

const todoLineNode: VirtualDomNode = {
  childCount: 1,
  className: 'TodoLine',
  type: VirtualDomElements.Span,
}

export const renderTodo = (
  todo: Readonly<TodoItem>,
  index: number,
): readonly VirtualDomNode[] => {
  const description = todo.text || 'No description'
  return [
    todoListItemNode,
    {
      'aria-label': getTodoLabel(todo),
      childCount: 2,
      className: 'TodoItem',
      name: `todo:${index}`,
      onClick: handleClick,
      title: `${todo.path}:${todo.line}:${todo.column}`,
      type: VirtualDomElements.Button,
    },
    todoItemMainNode,
    {
      childCount: 1,
      className: mergeClassNames('TodoTag', `TodoTag${todo.tag}`),
      type: VirtualDomElements.Span,
    },
    text(todo.tag),
    todoTextNode,
    text(description),
    todoLocationNode,
    todoPathNode,
    text(todo.path),
    todoLineNode,
    text(`Line ${todo.line}`),
  ]
}
