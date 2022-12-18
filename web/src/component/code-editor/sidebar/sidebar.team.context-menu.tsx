import { FC } from "react"
import {
    Menu,
    Item
} from "react-contexify";


export const TEAM_SIDEBAR_MENU = "TEAM_SIDEBAR_MENU";


export enum TeamContextMenuType {
    AddTeam = "AddTeam",
    EditTeam = "EditTeam",
    DeleteTeam = "DeleteTeam",

    AddFlow = "AddFlow",

    EditMeta = "EditMeta"
}

interface TeamContextMenuProps {
    onItemClick: (item: TeamContextMenuType, props?: any) => void,
}

export const TeamContextMenu: FC<TeamContextMenuProps> = ({ onItemClick }) => {

    return <>
        <Menu theme={'dark'} id={TEAM_SIDEBAR_MENU}>
            <Item key={'create'}
                hidden={({ props }) => {
                    const { source } = props;
                    return 'workspace' !== source;
                }}
                onClick={() => onItemClick(TeamContextMenuType.AddTeam)}>
                Add Team
            </Item>

            <Item key={'edit'}
                hidden={({ props }) => {
                    const { source } = props;
                    return 'workspace' === source;
                }}
                onClick={({ props }) => onItemClick(TeamContextMenuType.EditTeam, props)}>
                Edit
            </Item>

            <Item key={'delete'}
                hidden={({ props }) => {
                    const { source } = props;
                    return 'workspace' === source;
                }} onClick={({ props }) => onItemClick(TeamContextMenuType.DeleteTeam, props)}>
                Delete
            </Item>

            <Item key={'add'}
                hidden={({ props }) => {
                    const { source } = props;
                    return 'workspace' === source;
                }}
                onClick={({ props }) => onItemClick(TeamContextMenuType.AddFlow, props)}>
                Add Flow
            </Item>

            <Item key={'edit-meta'}
                hidden={({ props }) => {
                    const { source } = props;
                    return 'workspace' !== source;
                }}
                onClick={() => onItemClick(TeamContextMenuType.EditMeta)}>
                Edit Meta
            </Item>
        </Menu>
    </>
}