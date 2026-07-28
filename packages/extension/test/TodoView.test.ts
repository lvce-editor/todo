import { expect, jest, test } from '@jest/globals'
import { view } from '../src/parts/TodoView/TodoView.ts'

test('defines the todo virtual dom view and refresh command', () => {
  expect(view).toMatchObject({
    displayName: 'Todo',
    icon: 'checklist',
    id: 'todo.views.todos',
    kind: 'virtualDom',
    title: 'Todo',
  })
  expect(view.commands['todo.refresh']).toBeDefined()
  expect(view.eventListeners).toEqual([
    {
      name: 'handleClick',
      params: ['handleClick', 'event.currentTarget.name'],
    },
  ])
})

test('refreshes a todo view instance', async () => {
  const instance = {
    refresh: jest.fn(async () => {}),
  }

  await expect(view.commands['todo.refresh'](instance as never)).resolves.toBe(
    instance,
  )
  expect(instance.refresh).toHaveBeenCalled()
})
