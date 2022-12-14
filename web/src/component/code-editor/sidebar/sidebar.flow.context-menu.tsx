import { FC } from "react"
import {
    Menu,
    Item
} from "react-contexify";
import { Flow } from "../../../model";


export const FLOW_SIDEBAR_MENU = "FLOW_SIDEBAR_MENU";


export enum FlowContextMenuType {
    Edit = "Edit",
    Open = 'Open',
    Delete = 'Delete'
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
                Edit Flow
            </Item>

            <Item onClick={({ props }) => {
                const flow = props as Flow;
                onItemClick(FlowContextMenuType.Open, flow)
            }}>
                Open Flow
            </Item>

            <Item onClick={({ props }) => {
                const flow = props as Flow;
                onItemClick(FlowContextMenuType.Delete, flow)
            }}>
                Delete Flow
            </Item>
        </Menu>
    </>
}