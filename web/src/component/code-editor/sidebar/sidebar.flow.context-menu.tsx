import { FC } from "react"
import {
    Menu,
    Item
} from "react-contexify";
import { Flow } from "../../../model";


export const FLOW_SIDEBAR_MENU = "FLOW_SIDEBAR_MENU";


export enum FlowContextMenuType {
    Edit = "Edit",
    Delete = 'Delete',
    Copy = 'Copy'
}

interface FlowContextMenuProps {
    onItemClick: (item: FlowContextMenuType, props?: any) => void
}

export const FlowContextMenu: FC<FlowContextMenuProps> = ({ onItemClick }) => {

    return <>
        <Menu theme={'dark'} id={FLOW_SIDEBAR_MENU}>
            <Item onClick={({ props }) => {
                const flow = props as Flow;
                onItemClick(FlowContextMenuType.Edit, flow)
            }}>
                Edit
            </Item>

            <Item onClick={({ props }) => {
                const flow = props as Flow;
                onItemClick(FlowContextMenuType.Copy, flow)
            }}>
                Copy
            </Item>

            <Item onClick={({ props }) => {
                const flow = props as Flow;
                onItemClick(FlowContextMenuType.Delete, flow)
            }}>
                Delete
            </Item>
        </Menu>
    </>
}