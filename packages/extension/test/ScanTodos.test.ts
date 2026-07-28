import type { FileSystemDirent } from '@lvce-editor/api'
import { expect, test } from '@jest/globals'
import {
  isExcludedDirectory,
  scanTodos,
  type TodoScannerFileSystem,
} from '../src/parts/ScanTodos/ScanTodos.ts'

const directory = (name: string): FileSystemDirent => ({ name, type: 3 })
const file = (name: string): FileSystemDirent => ({ name, type: 7 })

const createFileSystem = (
  directories: Readonly<Record<string, readonly FileSystemDirent[]>>,
  files: Readonly<Record<string, string>>,
  workspace = '/workspace',
): TodoScannerFileSystem => ({
  async getWorkspaceUri(): Promise<string> {
    return workspace
  },
  async readDirWithFileTypes(
    uri: string,
  ): Promise<readonly FileSystemDirent[]> {
    const entries = directories[uri]
    if (!entries) {
      throw new Error(`Missing directory: ${uri}`)
    }
    return entries
  },
  async readFile(uri: string): Promise<string> {
    if (!(uri in files)) {
      throw new Error(`Missing file: ${uri}`)
    }
    return files[uri] || ''
  },
})

test('scans nested project files and sorts results', async () => {
  const fileSystem = createFileSystem(
    {
      '/workspace': [directory('src'), file('README.md')],
      '/workspace/src': [file('z.ts'), file('a.ts')],
    },
    {
      '/workspace/README.md': '# Project',
      '/workspace/src/a.ts': '// TODO first\n// FIXME second',
      '/workspace/src/z.ts': '// TODO last',
    },
  )

  await expect(scanTodos(fileSystem)).resolves.toEqual({
    scannedFileCount: 3,
    todos: [
      {
        column: 4,
        line: 1,
        path: 'src/a.ts',
        tag: 'TODO',
        text: 'first',
        uri: '/workspace/src/a.ts',
      },
      {
        column: 4,
        line: 2,
        path: 'src/a.ts',
        tag: 'FIXME',
        text: 'second',
        uri: '/workspace/src/a.ts',
      },
      {
        column: 4,
        line: 1,
        path: 'src/z.ts',
        tag: 'TODO',
        text: 'last',
        uri: '/workspace/src/z.ts',
      },
    ],
    truncated: false,
    workspace: '/workspace',
  })
})

test('excludes dependency, generated, and version control directories', async () => {
  const excluded = [
    '.git',
    '.hg',
    '.svn',
    'node_modules',
    'dist',
    'build',
    'coverage',
    'vendor',
  ]
  const fileSystem = createFileSystem(
    {
      '/workspace': [...excluded.map(directory), directory('src')],
      '/workspace/src': [file('main.ts')],
    },
    {
      '/workspace/src/main.ts': '// TODO visible',
    },
  )

  const result = await scanTodos(fileSystem)

  expect(result.scannedFileCount).toBe(1)
  expect(result.todos).toHaveLength(1)
  expect(excluded.every(isExcludedDirectory)).toBe(true)
  expect(isExcludedDirectory('src')).toBe(false)
})

test('skips binary, large, unreadable, and inaccessible nested files', async () => {
  const fileSystem = createFileSystem(
    {
      '/workspace': [
        file('binary.bin'),
        file('large.txt'),
        file('missing.txt'),
        directory('unreadable'),
      ],
    },
    {
      '/workspace/binary.bin': '\0// TODO hidden',
      '/workspace/large.txt': `// TODO hidden${'x'.repeat(1_000_000)}`,
    },
  )

  await expect(scanTodos(fileSystem)).resolves.toMatchObject({
    scannedFileCount: 3,
    todos: [],
  })
})

test('returns an empty result when no workspace is open', async () => {
  const fileSystem = createFileSystem({}, {}, '')

  await expect(scanTodos(fileSystem)).resolves.toEqual({
    scannedFileCount: 0,
    todos: [],
    truncated: false,
    workspace: '',
  })
})

test('reports a root directory error', async () => {
  const fileSystem = createFileSystem({}, {})

  await expect(scanTodos(fileSystem)).rejects.toThrow(
    'Missing directory: /workspace',
  )
})
