import type { TodoItem } from '../TodoItem/TodoItem.ts'

const commentMarkers = ['<!--', '//', '/*', '#', '*', '--', ';', '%', 'REM ']
const markdownExtensions = ['.md', '.markdown', '.mdx']
const newLinePattern = /\r?\n/
const todoTagPattern = /^(TODO|FIXME|HACK|BUG|XXX)\b/i

interface CommentStart {
  readonly contentStart: number
}

const isMarkerBoundary = (line: string, index: number): boolean => {
  return index === 0 || (line[index - 1] || '').trim() === ''
}

const isEscaped = (line: string, index: number): boolean => {
  let slashCount = 0
  for (let cursor = index - 1; cursor >= 0; cursor--) {
    if (line[cursor] !== '\\') {
      break
    }
    slashCount++
  }
  return slashCount % 2 === 1
}

const isInsideQuotedString = (line: string, end: number): boolean => {
  let quote = ''
  for (let index = 0; index < end; index++) {
    const character = line[index] || ''
    if (quote) {
      if (character === quote && !isEscaped(line, index)) {
        quote = ''
      }
      continue
    }
    if (["'", '"', '`'].includes(character)) {
      quote = character
    }
  }
  return Boolean(quote)
}

const isLineStartMarker = (marker: string): boolean => {
  return marker === '*' || marker === 'REM '
}

const findMarker = (line: string, marker: string): CommentStart | undefined => {
  const lowerLine = line.toLowerCase()
  const lowerMarker = marker.toLowerCase()
  let index = lowerLine.indexOf(lowerMarker)
  while (index !== -1) {
    const prefix = line.slice(0, index)
    if (
      isMarkerBoundary(line, index) &&
      !isInsideQuotedString(line, index) &&
      (!isLineStartMarker(marker) || prefix.trim() === '')
    ) {
      return { contentStart: index + marker.length }
    }
    index = lowerLine.indexOf(lowerMarker, index + marker.length)
  }
  return undefined
}

const isMarkdown = (path: string): boolean => {
  const lowerPath = path.toLowerCase()
  return markdownExtensions.some((extension) => lowerPath.endsWith(extension))
}

const findCommentStart = (
  line: string,
  path: string,
): CommentStart | undefined => {
  let result: CommentStart | undefined
  const markers = isMarkdown(path) ? ['<!--'] : commentMarkers
  for (const marker of markers) {
    const candidate = findMarker(line, marker)
    if (
      candidate &&
      (!result || candidate.contentStart < result.contentStart)
    ) {
      result = candidate
    }
  }
  return result
}

const removeOwner = (value: string): string => {
  if (!value.startsWith('(')) {
    return value
  }
  const closingIndex = value.indexOf(')')
  return closingIndex === -1 ? value : value.slice(closingIndex + 1)
}

const removeTrailingComment = (value: string): string => {
  const trimmed = value.trim()
  if (trimmed.endsWith('-->')) {
    return trimmed.slice(0, -3).trim()
  }
  if (trimmed.endsWith('*/')) {
    return trimmed.slice(0, -2).trim()
  }
  return trimmed
}

export const parseTodoComments = (
  content: string,
  path: string,
  uri: string,
): readonly TodoItem[] => {
  const todos: TodoItem[] = []
  const lines = content.split(newLinePattern)
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] || ''
    const commentStart = findCommentStart(line, path)
    if (!commentStart) {
      continue
    }
    const comment = line.slice(commentStart.contentStart)
    const trimmedComment = comment.trimStart()
    const match = todoTagPattern.exec(trimmedComment)
    if (!match) {
      continue
    }
    const rawTag = match[1] || 'TODO'
    const leadingWhitespace = comment.length - trimmedComment.length
    const tagIndex = commentStart.contentStart + leadingWhitespace
    const afterTag = trimmedComment.slice(rawTag.length).trimStart()
    const withoutOwner = removeOwner(afterTag).trimStart()
    const description = withoutOwner.startsWith(':')
      ? withoutOwner.slice(1)
      : withoutOwner
    todos.push({
      column: tagIndex + 1,
      line: index + 1,
      path,
      tag: rawTag.toUpperCase(),
      text: removeTrailingComment(description),
      uri,
    })
  }
  return todos
}
