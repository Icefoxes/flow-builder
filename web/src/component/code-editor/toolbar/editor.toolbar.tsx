import { FC } from "react"
import { Spin, Tooltip } from "antd";
import {
    SaveOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import './editor.toolbar.scss';
import { Flow } from "../../../model";


export enum EditorToolbarControlType {
    Save = 'Save',
    Edit = 'Edit'
}

interface EditorToolBarProps {
    onClick: (type: EditorToolbarControlType, props?: any) => void,
    isLoading: boolean,
    flow?: Flow | null
}

export const EditorToolBarComponent: FC<EditorToolBarProps> = ({ onClick, isLoading, flow }) => {
    return <div className="toolbar-container" >
        {flow && <div className="tab">{flow.name}</div>}
        <div className="toolbar-operations">
            <Spin className="toolbar-icon" spinning={isLoading} />

            <Tooltip title="Save">
                <SaveOutlined className="toolbar-icon" onClick={() => onClick(EditorToolbarControlType.Save)} />
            </Tooltip>

            <Tooltip title="Go to Diagram">
                <ApartmentOutlined className="toolbar-icon" onClick={() => onClick(EditorToolbarControlType.Edit)} />
            </Tooltip>
        </div>

    </div>
}