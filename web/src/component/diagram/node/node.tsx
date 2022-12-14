import { memo } from "react";
import { notification } from "antd";
import {
    CopyOutlined
} from '@ant-design/icons';
import { Handle, Position } from 'reactflow';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SiApachekafka, SiApacheflink, SiRedhat, SiElasticsearch, SiMicrosoftsqlserver, SiProcessingfoundation, SiRedis, SiIbm, SiCloudways, SiGoogleplay } from 'react-icons/si';
import { FaWarehouse } from 'react-icons/fa';
import hbase from '../../../asset/hbase.svg';
import kdb from '../../../asset/kdb.svg';
import solace from '../../../asset/solace.png';
import './node.scss';
import { NodeData, NodeType } from "../../../model";

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

export enum AdditionalInfoType {
    Input = 'Input',
    Selection = 'Selection',
    CheckBox = 'CheckBox',
    TextArea = 'TextArea',
}

interface AdditionalInfo {
    // for check box
    default?: boolean | string;
    // for selections
    selections?: string[]

    // common
    type: AdditionalInfoType;
    name: string;
    required: boolean;
}


export const getBasicInfo = () => {
    return [
        {
            name: 'Label',
            required: true,
            type: AdditionalInfoType.Input,

        },
        {
            name: 'Description',
            required: false,
            type: AdditionalInfoType.Input,

        },
        {
            name: 'Redirect',
            required: false,
            type: AdditionalInfoType.Input,

        },
        {
            name: 'Reposiotry',
            required: false,
            type: AdditionalInfoType.Input,

        },
    ] as AdditionalInfo[]
}

export const getAdditionalInfo = (type: NodeType) => {
    switch (type) {
        case NodeType.Flink:
            return [
                {
                    name: 'Cluster',
                    required: true,
                    type: AdditionalInfoType.Selection,
                    selections: ['ClusterA', 'ClusterB'],
                    default: 'ClusterA'
                },
                {
                    name: 'Venv',
                    required: true,
                    type: AdditionalInfoType.CheckBox,
                    default: true
                }] as AdditionalInfo[]
        case NodeType.Redhat:
            return [{
                name: 'Machine',
                required: true,
                type: AdditionalInfoType.Input
            },
            {
                name: 'Actuator',
                required: false,
                type: AdditionalInfoType.Input
            },
            {
                name: 'Autosys',
                required: false,
                type: AdditionalInfoType.TextArea
            },
            ] as AdditionalInfo[];
        case NodeType.StoreProcedure:
            return [{
                name: 'Persistence',
                required: true,
                type: AdditionalInfoType.CheckBox
            },
            {
                name: 'SP',
                required: false,
                type: AdditionalInfoType.TextArea
            }] as AdditionalInfo[];
        case NodeType.Kafka:
            return [{
                name: 'Region',
                required: true,
                selections: ['NY', 'MW'],
                default: 'NY',
                type: AdditionalInfoType.Selection
            },
            {
                name: 'MessageType',
                required: true,
                selections: ['AVRO', 'STRING'],
                default: 'AVRO',
                type: AdditionalInfoType.Selection
            },
            {
                name: 'Jar',
                required: false,
                type: AdditionalInfoType.Input
            }] as AdditionalInfo[];
        case NodeType.HBase:
            return [{
                name: 'Namespace',
                required: true,
                type: AdditionalInfoType.Input
            },
            {
                name: 'MessageType',
                required: true,
                selections: ['AVRO', 'STRING', 'JSON'],
                default: 'AVRO'
            }] as AdditionalInfo[];
        case NodeType.S3:
            return [{
                name: 'Bucket',
                required: true,
                type: AdditionalInfoType.Input
            }] as AdditionalInfo[];
        default:
            return [] as AdditionalInfo[];
    }
}

export const NodeConfig = {
    Width: 200,
    NodeSpace: 50,
    Height: 40
}

export const UserDefinedNode = memo<{ data: NodeData, id: string }>(({ data: { label, description, nodeType }, id }) => {
    return <div className="node-root">
        <Handle
            position={'right' as Position}
            type="target"
            style={{ background: '#555' }}
        />
        <Handle
            position={'bottom' as Position}
            type="target"
            style={{ background: '#555' }}
        />
        <div className="text-container" data-id={id} style={{ borderRadius: getType(nodeType) === NodeTypePerBusiness.Processor ? '15px' : '0px' }}>
            <div style={{ width: '80%' }} data-id={id}>
                <span className="text-label" data-id={id} style={{ fontSize: `${(label.length / 160) * 100}%`, }}>{label}</span>
                <span className="text-description" data-id={id} style={{ fontSize: '40%' }}>{`${nodeType} ${description ? '|' + description : ''}`}</span>
            </div>
            <div className="icon-container" data-id={id}>
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
        {getType(nodeType) !== NodeTypePerBusiness.External && <Handle
            type="source"
            position={'left' as Position}
            style={{ background: '#555' }}
        />}
        {getType(nodeType) !== NodeTypePerBusiness.External && <Handle
            position={'top' as Position}
            type="source"
            style={{ background: '#555' }}
        />}
    </div>
})