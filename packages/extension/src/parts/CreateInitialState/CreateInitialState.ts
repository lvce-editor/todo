import type { TodoViewState } from '../TodoViewState/TodoViewState.ts'

export const createInitialState = (): TodoViewState => ({
  error: '',
  loading: true,
  scannedFileCount: 0,
  todos: [],
  truncated: false,
  workspace: '',
})
