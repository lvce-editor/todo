import {
  AriaRoles,
  mergeClassNames,
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'

const handleClick = 'handleClick'

const actionsNode: VirtualDomNode = {
  childCount: 1,
  className: 'Actions',
  role: AriaRoles.ToolBar,
  type: VirtualDomElements.Div,
}

const refreshButtonNode: VirtualDomNode = {
  childCount: 1,
  className: 'IconButton',
  'data-command': 'todo.refresh',
  name: 'refresh',
  onClick: handleClick,
  title: 'Refresh Todos',
  type: VirtualDomElements.Button,
}

const refreshIconNode: VirtualDomNode = {
  childCount: 0,
  className: mergeClassNames('MaskIcon', 'MaskIconRefresh'),
  role: AriaRoles.None,
  type: VirtualDomElements.Div,
}

export const renderActionsDom = (): readonly VirtualDomNode[] => {
  return [actionsNode, refreshButtonNode, refreshIconNode]
}
