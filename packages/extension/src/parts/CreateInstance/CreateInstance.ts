import type {
  ViewContext,
  ViewEvent,
  VirtualDomViewInstance,
} from '@lvce-editor/api'
import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { createInitialState } from '../CreateInitialState/CreateInitialState.ts'
import { getErrorMessage } from '../GetErrorMessage/GetErrorMessage.ts'
import { openTodo } from '../OpenTodo/OpenTodo.ts'
import { renderActionsDom } from '../RenderActionsDom/RenderActionsDom.ts'
import { renderTodoView } from '../RenderTodoView/RenderTodoView.ts'
import { scanTodos, type TodoScanResult } from '../ScanTodos/ScanTodos.ts'

export interface ActiveTodoViewInstance extends VirtualDomViewInstance {
  readonly getContext: () => Readonly<Record<string, boolean>>
  readonly handleClick: (name: string) => Promise<void>
  readonly refresh: () => Promise<void>
  readonly renderActionsDom: () => readonly VirtualDomNode[]
}

export interface TodoInstanceDependencies {
  readonly openTodo: typeof openTodo
  readonly scanTodos: () => Promise<TodoScanResult>
}

const defaultDependencies: TodoInstanceDependencies = {
  openTodo,
  scanTodos,
}

const activeInstances = new Set<ActiveTodoViewInstance>()

export const refreshActiveTodoViewInstances = async (): Promise<void> => {
  await Promise.all(Array.from(activeInstances, async (instance) => instance.refresh()))
}

export const createInstance = (
  context?: ViewContext,
  dependencies: Readonly<TodoInstanceDependencies> = defaultDependencies,
): ActiveTodoViewInstance => {
  const state = createInitialState()

  const requestRerender = async (): Promise<void> => {
    await context?.requestRerender()
  }

  const refresh = async (renderLoading: boolean): Promise<void> => {
    state.loading = true
    state.error = ''
    if (renderLoading) {
      await requestRerender()
    }
    try {
      const result = await dependencies.scanTodos()
      state.scannedFileCount = result.scannedFileCount
      state.todos = result.todos
      state.truncated = result.truncated
      state.workspace = result.workspace
    } catch (error) {
      state.error = `Unable to scan todo comments: ${getErrorMessage(error)}`
      state.scannedFileCount = 0
      state.todos = []
      state.truncated = false
      state.workspace = ''
    } finally {
      state.loading = false
      await requestRerender()
    }
  }

  const instance: ActiveTodoViewInstance = {
    dispose(): void {
      activeInstances.delete(instance)
    },
    getContext(): Readonly<Record<string, boolean>> {
      return {
        'todo.todosFocus': true,
      }
    },
    async handleClick(name: string): Promise<void> {
      if (name === 'refresh') {
        await refresh(true)
        return
      }
      if (!name.startsWith('todo:')) {
        return
      }
      const index = Math.trunc(Number(name.slice('todo:'.length)))
      const { todos } = state
      const todo = todos[index]
      if (!todo) {
        return
      }
      await dependencies.openTodo(todo)
    },
    async handleEvent(event: Readonly<ViewEvent>): Promise<void> {
      if (event.type === 'click' && event.name) {
        await instance.handleClick(event.name)
      }
    },
    async refresh(): Promise<void> {
      await refresh(true)
    },
    render(): readonly VirtualDomNode[] {
      return renderTodoView(state)
    },
    renderActionsDom(): readonly VirtualDomNode[] {
      return renderActionsDom()
    },
  }
  activeInstances.add(instance)
  void refresh(false)
  return instance
}
