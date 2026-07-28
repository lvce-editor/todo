import {
  getWorkspaceUri,
  readDirWithFileTypes,
  readFile,
  type FileSystemDirent,
} from '@lvce-editor/api'
import type { TodoItem } from '../TodoItem/TodoItem.ts'
import {
  directoryType,
  excludedDirectoryNames,
  fileType,
  maximumFileCharacters,
  maximumFilesToScan,
  scannerConcurrency,
} from '../Constants/Constants.ts'
import { parseTodoComments } from '../ParseTodoComments/ParseTodoComments.ts'
import { joinPath, joinRelativePath } from '../Path/Path.ts'

export interface TodoScannerFileSystem {
  readonly getWorkspaceUri: () => Promise<string>
  readonly readDirWithFileTypes: (
    uri: string,
  ) => Promise<readonly FileSystemDirent[]>
  readonly readFile: (uri: string) => Promise<string>
}

export interface TodoScanResult {
  readonly scannedFileCount: number
  readonly todos: readonly TodoItem[]
  readonly truncated: boolean
  readonly workspace: string
}

interface FileToScan {
  readonly path: string
  readonly uri: string
}

interface FileCollector {
  readonly add: (file: Readonly<FileToScan>) => void
  readonly getSize: () => number
}

const defaultFileSystem: TodoScannerFileSystem = {
  getWorkspaceUri,
  readDirWithFileTypes,
  readFile,
}

export const isExcludedDirectory = (name: string): boolean => {
  return excludedDirectoryNames.has(name.toLowerCase())
}

const collectFiles = async (
  fileSystem: Readonly<TodoScannerFileSystem>,
  uri: string,
  relativePath: string,
  collector: Readonly<FileCollector>,
  isRoot: boolean,
): Promise<void> => {
  let entries: readonly FileSystemDirent[]
  try {
    entries = await fileSystem.readDirWithFileTypes(uri)
  } catch (error) {
    if (isRoot) {
      throw error
    }
    return
  }
  await Promise.all(
    entries.map(async (entry) => {
      if (collector.getSize() >= maximumFilesToScan) {
        return
      }
      const childUri = joinPath(uri, entry.name)
      const childPath = joinRelativePath(relativePath, entry.name)
      if (entry.type === directoryType) {
        if (!isExcludedDirectory(entry.name)) {
          await collectFiles(fileSystem, childUri, childPath, collector, false)
        }
        return
      }
      if (entry.type === fileType) {
        collector.add({ path: childPath, uri: childUri })
      }
    }),
  )
}

const compareTodos = (
  left: Readonly<TodoItem>,
  right: Readonly<TodoItem>,
): number => {
  return (
    left.path.localeCompare(right.path) ||
    left.line - right.line ||
    left.column - right.column
  )
}

const scanFiles = async (
  fileSystem: Readonly<TodoScannerFileSystem>,
  files: readonly FileToScan[],
): Promise<readonly TodoItem[]> => {
  const todos: TodoItem[] = []
  let nextIndex = 0
  const scanNext = async (): Promise<void> => {
    const index = nextIndex
    nextIndex++
    const file = files[index]
    if (!file) {
      return
    }
    try {
      const content = await fileSystem.readFile(file.uri)
      if (content.length <= maximumFileCharacters && !content.includes('\0')) {
        todos.push(...parseTodoComments(content, file.path, file.uri))
      }
    } catch {
      // A single unreadable or transient file must not make the view unusable.
    }
    await scanNext()
  }
  const workerCount = Math.min(scannerConcurrency, files.length)
  await Promise.all(Array.from({ length: workerCount }, async () => scanNext()))
  return todos.toSorted(compareTodos)
}

export const scanTodos = async (
  fileSystem: Readonly<TodoScannerFileSystem> = defaultFileSystem,
): Promise<TodoScanResult> => {
  const workspace = await fileSystem.getWorkspaceUri()
  if (!workspace) {
    return {
      scannedFileCount: 0,
      todos: [],
      truncated: false,
      workspace: '',
    }
  }
  const files: FileToScan[] = []
  const collector: FileCollector = {
    add(file): void {
      files.push(file)
    },
    getSize(): number {
      return files.length
    },
  }
  await collectFiles(fileSystem, workspace, '', collector, true)
  const todos = await scanFiles(fileSystem, files)
  return {
    scannedFileCount: files.length,
    todos,
    truncated: files.length >= maximumFilesToScan,
    workspace,
  }
}
