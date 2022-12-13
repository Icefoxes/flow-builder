import { FC } from "react"
import { Tooltip } from "antd";
import {
    SaveOutlined,
    EditOutlined
} from '@ant-design/icons';
import './diagram.toolbar.scss';


export enum ControlType {
    Save = 'Save',
    Edit = 'Edit'
}

export const DiagramToolBarComponent: FC<{ onClick: (type: ControlType) => void }> = ({ onClick }) => {
    return <div className="diagram-toolbar-container" >
        <Tooltip title="Save">
            <SaveOutlined className="toolbar-icon" onClick={() => onClick(ControlType.Save)} />
        </Tooltip>

        <Tooltip title="Edit">
            <EditOutlined className="toolbar-icon" onClick={() => onClick(ControlType.Edit)} />
        </Tooltip>
    </div>
}