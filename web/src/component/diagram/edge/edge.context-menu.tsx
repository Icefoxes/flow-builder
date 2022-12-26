import { FC } from "react"
import {
    Item,
    Menu,
} from "react-contexify";

export const EDGE_MENU_ID = "EDGE_MENU";

export enum EdgeContextMenuType {
    EditEdge = "EditEdge",
    DeleteEdge = "DeleteEdge",
}

export const EdgeContextMenu: FC<{ onItemClick: (item: EdgeContextMenuType, props?: any) => void }> = ({ onItemClick }) => {

    return <>
        <Menu id={EDGE_MENU_ID}>
            <Item onClick={({ props }) => onItemClick(EdgeContextMenuType.EditEdge, props)} >
                Edit Edge
            </Item>

            <Item onClick={({ props }) => onItemClick(EdgeContextMenuType.DeleteEdge, props)} >
                Remove Edge
            </Item>
        </Menu>
    </>
}