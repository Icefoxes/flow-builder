import { FC } from "react"
import {
    Item,
    Menu,
} from "react-contexify";


export const DIAGRAM_MENU_ID = "EDGE_MENU";

export enum DiagramContextMenuType {
    AddNode = "AddNode",
}


export const DiagramContextMenu: FC<{ onItemClick: (item: DiagramContextMenuType, props?: any) => void }> = ({ onItemClick }) => {

    return <>
        <Menu id={DIAGRAM_MENU_ID}>
            <Item onClick={() => onItemClick(DiagramContextMenuType.AddNode)} >
                Add Node
            </Item>
        </Menu>
    </>
}