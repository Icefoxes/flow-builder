import { FC } from "react"
import {
    Menu,
    Item,
    Separator,
    Submenu,

} from "react-contexify";
import { GnomonNode, NodeType } from "../../../model";

export const NODE_MENU_ID = "NODE-MENU";

export interface ChangeNodeProps {
    id: string;
    type: NodeType;
}

export interface DeleteNodeProps {
    id: string;
}

export enum NodeContextMenuType {
    Create = "Create",
    ChangeType = "ChangeType",
    Delete = "Delete",
    Edit = "Edit"
}


export const NodeContextMenu: FC<{ onItemClick: (item: NodeContextMenuType, props?: any) => void }> = ({ onItemClick }) => {

    return <>
        <Menu id={NODE_MENU_ID}>
            <Item key='create' onClick={() => onItemClick(NodeContextMenuType.Create)}>
                Add Node
            </Item>
            <Item onClick={({ props }) => {
                const node = props as GnomonNode;
                onItemClick(NodeContextMenuType.Delete, { id: node.id });
            }}>
                Delete Node
            </Item>
            <Item key='edit' onClick={({ props }) => {
                const node = props as GnomonNode;
                onItemClick(NodeContextMenuType.Edit, node);
            }}>
                Edit Node
            </Item>
            <Separator />
            <Submenu key='change-type' label="Change Type">
                {Object.values(NodeType).map(nodeType => {
                    return (
                        <Item
                            key={nodeType}
                            hidden={({ props }) => {
                                const node = props as GnomonNode;
                                return node.data.nodeType === nodeType;
                            }}
                            onClick={({ props }) => {
                                const node = props as GnomonNode;
                                onItemClick(NodeContextMenuType.ChangeType, {
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
    </>
}