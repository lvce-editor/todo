import { expect, test } from '@jest/globals'
import { parseTodoComments } from '../src/parts/ParseTodoComments/ParseTodoComments.ts'

test('parses common todo comment styles', () => {
  const content = [
    '// TODO: ship the feature',
    'const value = 1 // FIXME handle zero',
    '# HACK temporary workaround',
    '/* BUG: broken layout */',
    '<!-- XXX remove legacy markup -->',
    '; todo lower case tag',
    'REM TODO support windows scripts',
    ' * TODO(owner): block comment task',
  ].join('\n')

  expect(
    parseTodoComments(content, 'src/main.ts', '/workspace/src/main.ts'),
  ).toEqual([
    {
      column: 4,
      line: 1,
      path: 'src/main.ts',
      tag: 'TODO',
      text: 'ship the feature',
      uri: '/workspace/src/main.ts',
    },
    {
      column: 20,
      line: 2,
      path: 'src/main.ts',
      tag: 'FIXME',
      text: 'handle zero',
      uri: '/workspace/src/main.ts',
    },
    {
      column: 3,
      line: 3,
      path: 'src/main.ts',
      tag: 'HACK',
      text: 'temporary workaround',
      uri: '/workspace/src/main.ts',
    },
    {
      column: 4,
      line: 4,
      path: 'src/main.ts',
      tag: 'BUG',
      text: 'broken layout',
      uri: '/workspace/src/main.ts',
    },
    {
      column: 6,
      line: 5,
      path: 'src/main.ts',
      tag: 'XXX',
      text: 'remove legacy markup',
      uri: '/workspace/src/main.ts',
    },
    {
      column: 3,
      line: 6,
      path: 'src/main.ts',
      tag: 'TODO',
      text: 'lower case tag',
      uri: '/workspace/src/main.ts',
    },
    {
      column: 5,
      line: 7,
      path: 'src/main.ts',
      tag: 'TODO',
      text: 'support windows scripts',
      uri: '/workspace/src/main.ts',
    },
    {
      column: 4,
      line: 8,
      path: 'src/main.ts',
      tag: 'TODO',
      text: 'block comment task',
      uri: '/workspace/src/main.ts',
    },
  ])
})

test('does not parse tags without a comment marker', () => {
  const content = [
    'const TODO = "not a comment"',
    'https://example.com/TODO',
    'TODO list heading',
    "const fixture = '  // TODO inside a string'",
    'const fixture = " # TODO inside a string"',
    'const fixture = ` /* TODO inside a string */`',
    'const product = value * TODO',
    '// ordinary comment',
    '',
  ].join('\n')

  expect(parseTodoComments(content, 'a.ts', '/a.ts')).toEqual([])
})

test('parses a comment after a quoted string with an escaped quote', () => {
  const content = 'const value = "don\\"t"; // TODO valid comment'

  expect(parseTodoComments(content, 'a.ts', '/a.ts')).toEqual([
    {
      column: 28,
      line: 1,
      path: 'a.ts',
      tag: 'TODO',
      text: 'valid comment',
      uri: '/a.ts',
    },
  ])
})

test('only parses html todo comments in markdown', () => {
  const content = ['# TODO heading', '<!-- TODO actual comment -->'].join('\n')

  expect(parseTodoComments(content, 'README.md', '/README.md')).toEqual([
    {
      column: 6,
      line: 2,
      path: 'README.md',
      tag: 'TODO',
      text: 'actual comment',
      uri: '/README.md',
    },
  ])
})

test('parses an empty todo description', () => {
  expect(parseTodoComments('// TODO', 'a.ts', '/a.ts')).toEqual([
    {
      column: 4,
      line: 1,
      path: 'a.ts',
      tag: 'TODO',
      text: '',
      uri: '/a.ts',
    },
  ])
})

test('keeps an unfinished owner suffix as the description', () => {
  expect(parseTodoComments('// TODO(owner', 'a.ts', '/a.ts')).toEqual([
    {
      column: 4,
      line: 1,
      path: 'a.ts',
      tag: 'TODO',
      text: '(owner',
      uri: '/a.ts',
    },
  ])
})
