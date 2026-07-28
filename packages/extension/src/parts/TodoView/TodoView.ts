import type { View } from '@lvce-editor/api'
import { viewId } from '../Constants/Constants.ts'
import {
  createInstance,
  type ActiveTodoViewInstance,
} from '../CreateInstance/CreateInstance.ts'

type TodoView = Omit<View<ActiveTodoViewInstance>, 'commands'> & {
  readonly commands: NonNullable<View<ActiveTodoViewInstance>['commands']>
  readonly eventListeners: readonly {
    readonly name: string
    readonly params: readonly string[]
  }[]
}

export const view: TodoView = {
  commands: {
    'todo.refresh': async (instance) => {
      await instance.refresh()
      return instance
    },
  },
  create: createInstance,
  displayName: 'Todo',
  eventListeners: [
    {
      name: 'handleClick',
      params: ['handleClick', 'event.currentTarget.name'],
    },
  ],
  icon: 'checklist',
  id: viewId,
  kind: 'virtualDom',
  title: 'Todo',
}
