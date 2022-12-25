import { FC } from "react"
import {
    Menu,
    Item
} from "react-contexify";
import { Flow } from "../../../model";


export const FLOW_SIDEBAR_MENU = "FLOW_SIDEBAR_MENU";


export enum FlowContextMenuType {
    EditFlow = "Edit",
    DeleteFlow = 'Delete',
    CopyFlow = 'Copy'
}

interface FlowContextMenuProps {
    onItemClick: (item: FlowContextMenuType, props?: any) => void
}

export const FlowContextMenu: FC<FlowContextMenuProps> = ({ onItemClick }) => {

    return <>
        <Menu theme={'dark'} id={FLOW_SIDEBAR_MENU}>
            <Item onClick={({ props }) => {
                const flow = props as Flow;
                onItemClick(FlowContextMenuType.EditFlow, flow)
            }}>
                Edit
            </Item>

            <Item onClick={({ props }) => {
                const flow = props as Flow;
                onItemClick(FlowContextMenuType.CopyFlow, flow)
            }}>
                Copy
            </Item>

            <Item onClick={({ props }) => {
                const flow = props as Flow;
                onItemClick(FlowContextMenuType.DeleteFlow, flow)
            }}>
                Delete
            </Item>
        </Menu>
    </>
}