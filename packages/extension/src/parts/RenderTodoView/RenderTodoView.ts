import {
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { TodoViewState } from '../TodoViewState/TodoViewState.ts'
import { renderTodoContent } from '../RenderTodoContent/RenderTodoContent.ts'

export const renderTodoView = (
  state: Readonly<TodoViewState>,
): readonly VirtualDomNode[] => {
  const content = renderTodoContent(state)
  return [
    {
      childCount: content.childCount,
      className: 'TodoView',
      type: VirtualDomElements.Div,
    },
    ...content.dom,
  ]
}
