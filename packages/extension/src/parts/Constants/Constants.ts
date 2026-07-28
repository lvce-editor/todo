export const viewId = 'todo.views.todos'

export const directoryType = 3

export const fileType = 7

export const maximumFileCharacters = 1_000_000

export const maximumFilesToScan = 10_000

export const scannerConcurrency = 16

export const excludedDirectoryNames = new Set([
  '.cache',
  '.git',
  '.hg',
  '.idea',
  '.next',
  '.nuxt',
  '.svn',
  '.turbo',
  '.yarn',
  'bower_components',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
  'target',
  'vendor',
])
