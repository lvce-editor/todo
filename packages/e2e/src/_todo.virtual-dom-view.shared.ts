import type { TestApi } from '@lvce-editor/test-with-playwright'

export interface WorkspaceFile {
  readonly content: string
  readonly path: string
}

export const createTodoWorkspace = async (
  api: Readonly<Pick<TestApi, 'FileSystem' | 'Workspace'>>,
  files: readonly WorkspaceFile[],
): Promise<string> => {
  const tmpDir = await api.FileSystem.getTmpDir()
  await api.FileSystem.setFiles(
    files.map((file) => ({
      content: file.content,
      uri: `${tmpDir}/${file.path}`,
    })),
  )
  await api.Workspace.setPath(tmpDir)
  return tmpDir
}

export const showTodo = async (Command: TestApi['Command']): Promise<void> => {
  await Command.executeExtensionCommand('todo.show')
  await Command.executeExtensionCommand('todo.refresh')
}

export const createTodoWorkspaceAndShow = async (
  api: Readonly<Pick<TestApi, 'Command' | 'FileSystem' | 'Workspace'>>,
  files: readonly WorkspaceFile[],
): Promise<string> => {
  const tmpDir = await createTodoWorkspace(api, files)
  await showTodo(api.Command)
  return tmpDir
}
