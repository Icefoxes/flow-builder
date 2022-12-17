
import { FC, useEffect, useRef, useState } from "react";
import { Form, Input, Select, Modal, Checkbox, Button, Space } from 'antd';
import {
    MinusCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { GnomonNode, NodeData, NodeType } from "../../../model";

const { TextArea } = Input;

interface AdditionalInfo {
    // for check box
    default?: boolean | string;
    // for selections
    selections?: string[];
    // for object
    children?: AdditionalInfo[];

    // common
    type: AdditionalInfoType;
    name: string;
    property?: string;
    required: boolean;
}

enum AdditionalInfoType {
    Input = 'Input',
    Selection = 'Selection',
    CheckBox = 'CheckBox',
    TextArea = 'TextArea',
    List = 'List'
}

const getBasicInfo = () => {
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

const getAdditionalInfo = (type: NodeType) => {
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
                property: 'messageType',
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
                property: 'messageType',
                required: true,
                selections: ['AVRO', 'STRING', 'JSON'],
                type: AdditionalInfoType.Selection,
                default: 'AVRO'
            }] as AdditionalInfo[];
        case NodeType.S3:
            return [{
                name: 'Bucket',
                required: true,
                type: AdditionalInfoType.Input
            }] as AdditionalInfo[];
        case NodeType.ElasticSearch:
            return [{
                name: 'Date Keys',
                property: 'dateKeys',
                required: true,
                type: AdditionalInfoType.List,
                children: [{
                    name: 'Key',
                    required: true,
                    type: AdditionalInfoType.Input
                },
                {
                    name: 'isTimestamp',
                    property: 'isTimestamp',
                    required: true,
                    type: AdditionalInfoType.CheckBox,
                }] as AdditionalInfo[]
            }] as AdditionalInfo[]
        default:
            return [] as AdditionalInfo[];
    }
}

interface NodeModalProps {
    node: GnomonNode,
    isModalOpen: boolean,
    handleOk: (data: GnomonNode) => void,
    toggleVisible: VoidFunction
}

const AdditionalInfoList = (name: string, label: string, infos: AdditionalInfo[]) => (
    <Form.List name={`${name}`}>
        {(fields, { add, remove }) => (
            <>
                {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                        {infos.map(info => {
                            const fieldName = info.property ? info.property : info.name.toLowerCase();
                            const props = {
                                key: `${field.name}-${fieldName}`,
                                name: [field.name, fieldName],
                                label: info.name,
                                rules: [{ required: info.required, message: `Please input your ${info.name}` }]
                            };


                            if (info.type === AdditionalInfoType.Input) {
                                return <>
                                    <Form.Item {...props}>
                                        <Input placeholder={`input ${info.name}`} />
                                    </Form.Item>
                                </>
                            }
                            else if (info.type === AdditionalInfoType.Selection && info.selections) {
                                return <>
                                    <Form.Item {...props}>
                                        <Select>
                                            {info.selections.map(opt => <Select.Option key={`${info.name}-${opt}`} value={opt}>{opt}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                </>
                            }
                            else if (info.type === AdditionalInfoType.CheckBox) {
                                return <>
                                    <Form.Item {...props} valuePropName="checked">
                                        <Checkbox defaultChecked={true} />
                                    </Form.Item>
                                </>
                            }
                            return <></>
                        })}
                        <MinusCircleOutlined style={{ margin: '8px 0 0 0' }} onClick={() => remove(field.name)} />
                    </Space>
                ))}

                <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add {label}
                    </Button>
                </Form.Item>
            </>
        )}
    </Form.List>
)

const getInitValues = (type: NodeType) => {
    const infos = getBasicInfo().concat(getAdditionalInfo(type)).filter(f => !!f.default);
    let obj = {}
    infos.forEach(info => {
        const fieldName = info.property ? info.property : info.name.toLowerCase();
        obj = Object.assign({}, obj, {
            [fieldName]: info.default
        })
    });
    return obj;
}

export const getFields = (type: NodeType) => {
    return getBasicInfo().concat(getAdditionalInfo(type)).map(info => info.property ? info.property : info.name.toLowerCase());
}

export const getDiff = (previous: NodeType, next: NodeType) => {
    const after = getFields(next);
    let obj = {};
    getFields(previous).filter(x => after.indexOf(x) < 0).forEach(f => {
        obj = Object.assign({}, obj, {
            [f]: undefined
        })
    });
    return obj;
}

export const checkRequired = (data: NodeData) => {
    const properties = getBasicInfo().concat(getAdditionalInfo(data.nodeType)).filter(f => f.required).map(info => info.property ? info.property : info.name.toLowerCase());
    return !!!properties.find(pro => !!!(data as any)[pro])
}

export const NodeModalComponent: FC<NodeModalProps> = ({ isModalOpen, toggleVisible, handleOk, node }) => {
    const nodeType = node.data.nodeType;
    // hooks
    const [form] = Form.useForm();
    // state
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    // ref
    const draggleRef = useRef<HTMLDivElement>(null)
    // functions
    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    const modalTitle = (
        <div
            style={{
                width: '100%',
                height: '40px',
                cursor: 'move',
            }}
            onMouseOver={() => {
                if (disabled) {
                    setDisabled(false);
                }
            }}
            onMouseOut={() => {
                setDisabled(true);
            }}
            onFocus={() => { }}
            onBlur={() => { }} >
            Node Info
        </div>
    );

    const modalRender = (modal: React.ReactNode) => {
        return <>
            <Draggable
                disabled={disabled}
                bounds={bounds}
                onStart={(event, uiData) => onStart(event, uiData)}>
                <div ref={draggleRef}>{modal}</div>
            </Draggable>
        </>
    }

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(node.data);
    }, [node, form, isModalOpen]);

    const onOk = () => {
        form.validateFields()
            .then(v => {
                const data = v as NodeData;
                if (data) {
                    handleOk(Object.assign({}, node, {
                        data: Object.assign({}, node.data, {
                            ...data
                        })
                    }));
                    toggleVisible();
                }
            });
    }

    return <Modal
        forceRender
        keyboard
        title={modalTitle}
        modalRender={modalRender}
        open={isModalOpen}
        onOk={onOk}
        onCancel={toggleVisible}>
        <Form
            autoComplete="off"
            initialValues={getInitValues(nodeType)}
            form={form}>
            {getBasicInfo().concat(getAdditionalInfo(nodeType)).map(info => {
                const fieldName = info.property ? info.property : info.name.toLowerCase();
                const props = {
                    key: `${node.id}-${fieldName}`,
                    name: fieldName,
                    label: info.name,
                    rules: [{ required: info.required, message: `Please input your ${info.name}` }]
                };

                if (info.type === AdditionalInfoType.Input) {
                    return <>
                        <Form.Item {...props} >
                            <Input placeholder={`input ${info.name}`} />
                        </Form.Item>
                    </>
                }
                else if (info.type === AdditionalInfoType.Selection && info.selections) {
                    return <>
                        <Form.Item {...props} >
                            <Select>
                                {(info.selections).map(opt => <Select.Option key={`${node.id}-${fieldName}-${opt}`} value={opt}>{opt}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </>
                }
                else if (info.type === AdditionalInfoType.CheckBox) {
                    return <>
                        <Form.Item {...props} valuePropName="checked">
                            <Checkbox defaultChecked={true} />
                        </Form.Item>
                    </>
                }
                else if (info.type === AdditionalInfoType.TextArea) {
                    return <>
                        <Form.Item {...props}>
                            <TextArea rows={4} />
                        </Form.Item>
                    </>
                }
                else if (info.type === AdditionalInfoType.List && info.children) {
                    return <>
                        {AdditionalInfoList(info.name, info.name, info.children)}
                    </>
                }
                return <></>
            })}
        </Form>
    </Modal>
}
