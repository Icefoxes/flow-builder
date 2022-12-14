import { FC } from "react"
import { Tooltip } from "antd";
import {
    SaveOutlined,
    EditOutlined,
    UndoOutlined,
} from '@ant-design/icons';
import './diagram.toolbar.scss';


export enum ControlType {
    Save = 'Save',
    Edit = 'Edit',
    Undo = 'Undo',
    Redo = 'Redo',
}

export const DiagramToolBarComponent: FC<{ onClick: (type: ControlType) => void, canUndo: boolean, canRedo: boolean }> = ({ onClick, canUndo, canRedo }) => {
    return <div className="diagram-toolbar-container" >
        <Tooltip title="Undo">
            <UndoOutlined disabled={!canUndo} className={canUndo ? "toolbar-icon" : "disabled-icon"} onClick={() => onClick(ControlType.Undo)} />
        </Tooltip>

        <Tooltip title="Redo">
            <UndoOutlined disabled={!canRedo} className={canRedo ? "toolbar-icon" : "disabled-icon"} onClick={() => onClick(ControlType.Redo)} />
        </Tooltip>

        <Tooltip title="Save">
            <SaveOutlined className="toolbar-icon" onClick={() => onClick(ControlType.Save)} />
        </Tooltip>

        <Tooltip title="Edit">
            <EditOutlined className="toolbar-icon" onClick={() => onClick(ControlType.Edit)} />
        </Tooltip>
    </div>
}