import React, { memo } from "react";
import { notification, Tooltip } from "antd";
import {
    CopyOutlined
} from '@ant-design/icons';
import { Handle, Position } from 'reactflow';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Textfit } from 'react-textfit';
import './node.scss';
import { FunctionalTypeEnum, NodeData, NodeTypeMeta } from "../../../model";
import { checkRequired } from "./node.modal";
import { ICONS } from "../../shared";


export const NodeConfig = {
    Width: 300,
    NodeSpace: 50,
    Height: 40
}

const trim = (str: string) => {
    return str.length > 60 ? `${str.substring(0, 30)}...${str.substring(str.length - 30, str.length)}` : str;
}

export const UserDefinedNode = memo<{ data: NodeData, id: string }>(({ data, id }) => {
    const meta = (JSON.parse(localStorage.getItem('META') || '[]') as NodeTypeMeta[]).find(me => me.name === data.nodeType);

    const { label, description, nodeType } = data;

    const isComplete = React.useCallback(() => {
        return checkRequired(data);
    }, [data])

    return <div className="node-root" data-id={id}>
        <Handle
            position={Position.Top}
            type={'target'}
            id={Position.Top}
            style={{ background: '#555' }}
        />
        <div className="text-container" style={{
            borderRadius: meta?.functionalType === FunctionalTypeEnum.Processor ? '15px' : '0px',
            borderColor: isComplete() ? 'black' : 'red'
        }}>
            <div style={{ width: 'fit-content' }} >
                <Textfit className="text-label" mode="single" max={10} forceSingleModeWidth={true}>
                    <Tooltip title={label} style={{ width: 'fit-content' }}>
                        {trim(label)}
                    </Tooltip>
                </Textfit>

                <Textfit className="text-description" mode="single" max={7} forceSingleModeWidth={true} >
                    {`${nodeType} ${description ? ' | ' + description : ''}`}
                </Textfit>
            </div>
            <div className="icon-container" >
                {ICONS[meta?.icon || 0]}
                <CopyToClipboard text={label}
                    onCopy={() => {
                        notification.open({
                            message: 'Copied',
                            description: `${label}`
                        });
                    }} >
                    <CopyOutlined className="logo logo-copy" />

                </CopyToClipboard>
            </div>
        </div>
        <Handle
            position={Position.Bottom}
            id={Position.Bottom}
            type="source"
            style={{ background: '#555' }}
        />
    </div>
})