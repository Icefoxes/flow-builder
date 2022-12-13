import { FC } from "react"
import {
    Menu,
    Item
} from "react-contexify";


export const TEAM_SIDEBAR_MENU = "TEAM_SIDEBAR_MENU";


export enum TeamContextMenuType {
    Add = "Add"
}

interface TeamContextMenuProps {
    onItemClick: (item: TeamContextMenuType, props?: any) => void
}

export const TeamContextMenu: FC<TeamContextMenuProps> = ({ onItemClick }) => {

    return <>
        <Menu theme={'dark'} id={TEAM_SIDEBAR_MENU}>
            <Item onClick={() => onItemClick(TeamContextMenuType.Add)}>
                Add New Team
            </Item>
        </Menu>
    </>
}