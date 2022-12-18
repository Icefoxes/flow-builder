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
    Create = "Create",
    Copy = "Copy",
    ChangeType = "ChangeType",
    Delete = "Delete",
    Edit = "Edit"
}


export const NodeContextMenu: FC<{ onItemClick: (item: NodeContextMenuType, props?: any) => void }> = ({ onItemClick }) => {

    return <>
        <Menu id={NODE_MENU_ID}>
            <Item key='create' onClick={({ props }) => onItemClick(NodeContextMenuType.Create, props)}>
                Add Node
            </Item>

            <Item key='copy' onClick={({ props }) => {
                const node = props as GnomonNode;
                onItemClick(NodeContextMenuType.Copy, node);
            }}>
                Copy Node
            </Item>

            <Item key='edit' onClick={({ props }) => {
                const node = props as GnomonNode;
                onItemClick(NodeContextMenuType.Edit, node);
            }}>
                Edit Node
            </Item>

            <Item onClick={({ props }) => {
                const node = props as GnomonNode;
                onItemClick(NodeContextMenuType.Delete, node);
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