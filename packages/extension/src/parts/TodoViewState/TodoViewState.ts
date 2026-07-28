import type { TodoItem } from '../TodoItem/TodoItem.ts'

export interface TodoViewState {
  error: string
  loading: boolean
  scannedFileCount: number
  todos: readonly TodoItem[]
  truncated: boolean
  workspace: string
}
