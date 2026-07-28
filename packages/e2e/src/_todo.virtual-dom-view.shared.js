// @ts-check

/**
 * @typedef {import('@lvce-editor/test-with-playwright').TestApi} TestApi
 * @typedef {{readonly content: string, readonly path: string}} WorkspaceFile
 */

/**
 * @param {Readonly<Pick<TestApi, 'FileSystem' | 'Workspace'>>} api
 * @param {readonly WorkspaceFile[]} files
 * @returns {Promise<string>}
 */
export const createTodoWorkspace = async (api, files) => {
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

/**
 * @param {TestApi['Command']} Command
 * @returns {Promise<void>}
 */
export const showTodo = async (Command) => {
  await Command.executeExtensionCommand('todo.show')
  await Command.executeExtensionCommand('todo.refresh')
}

/**
 * @param {Readonly<Pick<TestApi, 'Command' | 'FileSystem' | 'Workspace'>>} api
 * @param {readonly WorkspaceFile[]} files
 * @returns {Promise<string>}
 */
export const createTodoWorkspaceAndShow = async (api, files) => {
  const tmpDir = await createTodoWorkspace(api, files)
  await showTodo(api.Command)
  return tmpDir
}
