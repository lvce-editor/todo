export interface TodoItem {
  readonly column: number
  readonly line: number
  readonly path: string
  readonly tag: string
  readonly text: string
  readonly uri: string
}
