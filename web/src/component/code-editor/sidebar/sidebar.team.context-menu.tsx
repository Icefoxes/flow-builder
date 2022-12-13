import { FC } from "react"
import {
    Menu,
    Item
} from "react-contexify";


export const TEAM_SIDEBAR_MENU = "TEAM_SIDEBAR_MENU";


export enum TeamContextMenuType {
    AddTeam = "AddTeam",
    AddFlow = "AddFlow"
}

interface TeamContextMenuProps {
    onItemClick: (item: TeamContextMenuType, props?: any) => void
}

export const TeamContextMenu: FC<TeamContextMenuProps> = ({ onItemClick }) => {

    return <>
        <Menu theme={'dark'} id={TEAM_SIDEBAR_MENU}>
            <Item key={'create'} onClick={() => onItemClick(TeamContextMenuType.AddTeam)}>
                Add New Team
            </Item>

            <Item key={'create'}
                hidden={({ props }) => {
                    const { source } = props;
                    return 'workspace' === source;
                }}
                onClick={({ props }) => onItemClick(TeamContextMenuType.AddFlow, props)}>
                Add New Flow
            </Item>
        </Menu>
    </>
}