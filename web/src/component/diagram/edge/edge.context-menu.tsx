import { FC } from "react"
import {
    Item,
    Menu,
} from "react-contexify";
import { GnomonEdge } from "../../../model";

export const EDGE_MENU_ID = "EDGE_MENU";

export enum EdgeContextMenuType {
    Create = "Create",
    Delete = "Delete",
}

export interface DeleteEdgeProps {
    id: string;
}

export const EdgeContextMenu: FC<{ onItemClick: (item: EdgeContextMenuType, props?: any) => void }> = ({ onItemClick }) => {

    return <>
        <Menu id={EDGE_MENU_ID}>
            <Item onClick={({ props }) => {
                const edge = props as GnomonEdge;
                onItemClick(EdgeContextMenuType.Delete, {
                    id: edge.id
                } as DeleteEdgeProps)
            }}>
                Remove Edge
            </Item>
        </Menu>
    </>
}