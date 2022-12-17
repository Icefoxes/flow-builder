import React, { memo } from "react";
import { notification, Tooltip } from "antd";
import {
    CopyOutlined
} from '@ant-design/icons';
import { Handle, Position } from 'reactflow';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Textfit } from 'react-textfit';
import { SiApachekafka, SiApacheflink, SiRedhat, SiElasticsearch, SiMicrosoftsqlserver, SiProcessingfoundation, SiRedis, SiIbm, SiCloudways, SiGoogleplay } from 'react-icons/si';
import { FaWarehouse } from 'react-icons/fa';
import hbase from '../../../asset/hbase.svg';
import kdb from '../../../asset/kdb.svg';
import solace from '../../../asset/solace.png';
import './node.scss';
import { NodeData, NodeType } from "../../../model";
import { checkRequired } from "./node.modal";

const getIcon = (type: NodeType) => {
    switch (type) {
        // processor
        case NodeType.Flink:
            return <SiApacheflink className="logo" />
        case NodeType.Redhat:
            return <SiRedhat className="logo" />
        case NodeType.StoreProcedure:
            return <SiProcessingfoundation className="logo" />
        // storage
        case NodeType.SQLServer:
            return <SiMicrosoftsqlserver className="logo" />
        case NodeType.Kafka:
            return <SiApachekafka className="logo" />
        case NodeType.ElasticSearch:
            return <SiElasticsearch className="logo" />
        case NodeType.HBase:
            return <img src={hbase} className="logo" alt="logo" />
        case NodeType.KDB:
        case NodeType.CloudKDB:
            return <img src={kdb} className="logo" alt="logo" />
        case NodeType.Redis:
            return <SiRedis className="logo" />
        case NodeType.S3:
            return <SiIbm className="logo" />
        // external
        case NodeType.ISGCloud:
            return <SiCloudways className="logo" />
        case NodeType.Rio:
        case NodeType.Ion:
            return <SiGoogleplay className="logo" />
        case NodeType.Olympus:
            return <FaWarehouse className="logo" />
        case NodeType.PxNET:
            return <img src={solace} className="logo" alt="logo" style={{ width: 40 }} />
        case NodeType.DataHighway:
            return <SiApachekafka className="logo" />
        default:
            return <SiApachekafka className="logo" />
    }
}

enum NodeTypePerBusiness {
    Processor = "Processor",
    Storage = "Storage",
    External = "External"
}

export const getType = (type: NodeType) => {
    switch (type) {
        // processor
        case NodeType.Flink:
        case NodeType.Redhat:
        case NodeType.StoreProcedure:
            return NodeTypePerBusiness.Processor
        // storage
        case NodeType.SQLServer:
        case NodeType.Kafka:
        case NodeType.ElasticSearch:
        case NodeType.HBase:
        case NodeType.KDB:
        case NodeType.CloudKDB:
        case NodeType.Redis:
        case NodeType.S3:
            return NodeTypePerBusiness.Storage;
        case NodeType.ISGCloud:
        case NodeType.Rio:
        case NodeType.Olympus:
        case NodeType.PxNET:
        case NodeType.Ion:
        case NodeType.DataHighway:
            return NodeTypePerBusiness.External;
        default:
            return NodeTypePerBusiness.External
    }
}


export const NodeConfig = {
    Width: 300,
    NodeSpace: 50,
    Height: 40
}

const trim = (str: string) => {
    return str.length > 60 ? `${str.substring(0, 30)}...${str.substring(str.length - 30, str.length)}` : str;
}


export const UserDefinedNode = memo<{ data: NodeData, id: string }>(({ data, id }) => {
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
            borderRadius: getType(nodeType) === NodeTypePerBusiness.Processor ? '15px' : '0px',
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
                {getIcon(nodeType)}
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