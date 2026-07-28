import {
  AriaRoles,
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'

export const renderMessage = (
  message: string,
  role: string = AriaRoles.Status,
): readonly VirtualDomNode[] => {
  return [
    {
      'aria-live': 'polite',
      childCount: 1,
      className: 'TodoMessage',
      role,
      type: VirtualDomElements.Div,
    },
    text(message),
  ]
}
