import { FC } from "react"
import {
    Menu,
    Item,
    Separator,
    Submenu,

} from "react-contexify";
import { GnomonNode } from "../../../model";
import utils from "../../shared/util";

export const NODE_MENU_ID = "NODE-MENU";

export interface ChangeNodeProps {
    id: string;
    type: string;
}

export enum NodeContextMenuType {
    CreateNode = "CreateNode",
    CopyNode = "CopyNode",
    ChangeNodeType = "ChangeNodeType",
    DeleteNode = "DeleteNode",
    EditNode = "EditNode"
}


export const NodeContextMenu: FC<{ onItemClick: (item: NodeContextMenuType, props?: any) => void }> = ({ onItemClick }) => {

    return (
        <Menu id={NODE_MENU_ID}>
            <Item key='create' onClick={({ props }) => onItemClick(NodeContextMenuType.CreateNode, props)}>
                Add Node
            </Item>

            <Item key='copy' onClick={({ props }) => {
                const node = props as GnomonNode;
                onItemClick(NodeContextMenuType.CopyNode, node);
            }}>
                Copy Node
            </Item>

            <Item key='edit' onClick={({ props }) => {
                const node = props as GnomonNode;
                onItemClick(NodeContextMenuType.EditNode, node);
            }}>
                Edit Node
            </Item>

            <Item onClick={({ props }) => {
                const node = props as GnomonNode;
                onItemClick(NodeContextMenuType.DeleteNode, node);
            }}>
                Delete Node
            </Item>

            <Separator />
            <Submenu key='change-type' label="Change Type">
                {utils.getNodeMetaData().map(nodeType => {
                    return (
                        <Item
                            key={nodeType}
                            hidden={({ props }) => {
                                const node = props as GnomonNode;
                                return node.data.nodeType === nodeType;
                            }}
                            onClick={({ props }) => {
                                const node = props as GnomonNode;
                                onItemClick(NodeContextMenuType.ChangeNodeType, {
                                    id: node.id,
                                    type: nodeType
                                } as ChangeNodeProps)
                            }}>
                            To {nodeType}
                        </Item>
                    )
                })}
            </Submenu>
        </Menu>
    )
}