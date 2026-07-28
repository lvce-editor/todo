import {
  AriaRoles,
  mergeClassNames,
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'

const handleClick = 'handleClick'

export const renderActionsDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'Actions',
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'IconButton',
      'data-command': 'todo.refresh',
      name: 'refresh',
      onClick: handleClick,
      title: 'Refresh Todos',
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: mergeClassNames('MaskIcon', 'MaskIconRefresh'),
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
  ]
}
