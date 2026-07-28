import type { TodoItem } from '../TodoItem/TodoItem.ts'

export const getTodoLabel = (todo: Readonly<TodoItem>): string => {
  const description = todo.text || 'No description'
  return `${todo.tag}: ${description}, ${todo.path}, line ${todo.line}`
}
