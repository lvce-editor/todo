import { expect, test } from '@jest/globals'
import manifest from '../extension.json' with { type: 'json' }

test('declares the isolated todo virtual dom view', () => {
  expect(manifest).toMatchObject({
    activation: expect.arrayContaining([
      'onView:todo.views.todos',
      'onCommand:todo.refresh',
    ]),
    browser: 'dist/todoMain.js',
    id: 'builtin.todo',
    isolated: true,
    name: 'Todo',
    repository: 'https://github.com/lvce-editor/todo',
    views: [
      expect.objectContaining({
        css: 'media/todo.css',
        id: 'todo.views.todos',
        kind: 'virtualDom',
      }),
    ],
  })
})
