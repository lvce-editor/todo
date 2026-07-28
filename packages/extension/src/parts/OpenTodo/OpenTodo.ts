import { executeCommand, openUri } from '@lvce-editor/api'
import type { TodoItem } from '../TodoItem/TodoItem.ts'

export interface TodoOpener {
  readonly openUri: (uri: string) => Promise<void>
  readonly setCursor: (rowIndex: number, columnIndex: number) => Promise<void>
}

const defaultOpener: TodoOpener = {
  openUri,
  async setCursor(rowIndex: number, columnIndex: number): Promise<void> {
    await executeCommand('Editor.cursorSet', rowIndex, columnIndex)
  },
}

export const openTodo = async (
  todo: Readonly<TodoItem>,
  opener: Readonly<TodoOpener> = defaultOpener,
): Promise<void> => {
  await opener.openUri(todo.uri)
  await opener.setCursor(todo.line - 1, todo.column - 1)
}
