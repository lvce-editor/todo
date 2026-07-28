import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'todo.virtual-dom-view.lazy-activation'

interface RunningExtension {
  readonly activationEvent: string
  readonly id: string
}

const extensionId = 'builtin.todo'
const viewId = 'todo.views.todos'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('ActivityBar.handleExtensionsChanged')

  const item = Locator('.ActivityBarItem[title="Todo"]')
  await expect(item).toBeVisible()
  await expect(item).toHaveAttribute('aria-selected', 'false')

  const runningBefore = (await Command.execute(
    'ExtensionManagement.getRunningExtensions',
  )) as readonly RunningExtension[]
  if (runningBefore.some((extension) => extension.id === extensionId)) {
    throw new Error(`Expected ${extensionId} to be lazily activated`)
  }

  await Command.execute('ActivityBar.handleClick', 0, 0, 0, viewId)

  await expect(item).toHaveAttribute('aria-selected', 'true')
  const message = Locator('.TodoMessage')
  await expect(message).toBeVisible()
  const runningAfter = (await Command.execute(
    'ExtensionManagement.getRunningExtensions',
  )) as readonly RunningExtension[]
  const extension = runningAfter.find((item) => item.id === extensionId)
  if (extension?.activationEvent !== `onView:${viewId}`) {
    throw new Error(`Expected ${extensionId} to be activated by ${viewId}`)
  }
}
