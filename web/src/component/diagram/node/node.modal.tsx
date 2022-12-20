
import { FC, useEffect } from "react";
import { Form, Input, Select, Modal, Checkbox, Button, Space } from 'antd';
import {
    MinusCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { AttributeInfo, AttributeType, GnomonNode, NodeData } from "../../../model";
import utils from "../../shared/util";

const { TextArea } = Input;

const getBasicInfo = () => {
    return [
        {
            name: 'Label',
            required: true,
            type: AttributeType.Input,

        },
        {
            name: 'Description',
            required: false,
            type: AttributeType.Input,

        },
        {
            name: 'Redirect',
            required: false,
            type: AttributeType.Input,

        },
        {
            name: 'Owner',
            required: false,
            type: AttributeType.Input,

        },
        {
            name: 'Reposiotry',
            required: false,
            type: AttributeType.Input,

        },
    ] as AttributeInfo[]
}

interface NodeModalProps {
    node: GnomonNode,
    isModalOpen: boolean,
    handleOk: (data: GnomonNode) => void,
    toggleVisible: VoidFunction
}
/*
-- Root
    property:
        0:
            - field 1
            - field 2
 */
const AdditionalInfoList = (name: string, label: string, infos: AttributeInfo[]) => (
    <Form.List key={name} name={`${name}`}>
        {(fields, { add, remove }) => (
            <>
                {fields.map((field) => (
                    <Space key={name} align="baseline">
                        {infos.map(info => {
                            const fieldName = info.property ? info.property : info.name.toLowerCase();
                            const props = {
                                key: `${field.name}-${fieldName}`,
                                name: [field.name, fieldName],
                                label: info.name,
                                rules: [{ required: info.required, message: `Please input your ${info.name}` }]
                            };


                            if (info.type === AttributeType.Input) {
                                return <>
                                    <Form.Item {...props}>
                                        <Input placeholder={`input ${info.name}`} />
                                    </Form.Item>
                                </>
                            }
                            else if (info.type === AttributeType.Selection && info.selections) {
                                return <>
                                    <Form.Item {...props}>
                                        <Select>
                                            {info.selections.map(opt => <Select.Option key={`${info.name}-${opt}`} value={opt}>{opt}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                </>
                            }
                            else if (info.type === AttributeType.CheckBox) {
                                return <>
                                    <Form.Item {...props} valuePropName="checked">
                                        <Checkbox defaultChecked={true} />
                                    </Form.Item>
                                </>
                            }
                            return <>
                                <Form.Item {...props} noStyle>
                                </Form.Item>
                            </>
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

const getInitValues = (type: string) => {
    const infos = getBasicInfo().concat(utils.getNodeMetaDataByType(type)).filter(f => !!f.default);
    let obj = {}
    infos.forEach(info => {
        const fieldName = info.property ? info.property : info.name.toLowerCase();
        obj = Object.assign({}, obj, {
            [fieldName]: info.default
        })
    });
    return obj;
}

const getFields = (type: string) => {
    return getBasicInfo().concat(utils.getNodeMetaDataByType(type)).map(info => info.property ? info.property : info.name.toLowerCase());
}

export const getDiff = (previous: string, next: string) => {
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
    const properties = getBasicInfo().concat(utils.getNodeMetaDataByType(data.nodeType)).filter(f => f.required).map(info => info.property ? info.property : info.name.toLowerCase());
    return !!!properties.find(pro => !(pro in data));
}

export const NodeModalComponent: FC<NodeModalProps> = ({ isModalOpen, toggleVisible, handleOk, node }) => {
    const nodeType = node.data.nodeType;
    // hooks
    const [form] = Form.useForm();

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
        title='Node Info'
        open={isModalOpen}
        onOk={onOk}
        onCancel={toggleVisible}>
        <Form
            autoComplete="off"
            initialValues={getInitValues(nodeType)}
            form={form}>
            {getBasicInfo().concat(utils.getNodeMetaDataByType(nodeType)).map(info => {
                const fieldName = info.property ? info.property : info.name.toLowerCase();
                const props = {
                    key: `${node.id}-${fieldName}`,
                    name: fieldName,
                    label: info.name,
                    rules: [{ required: info.required, message: `Please input your ${info.name}` }]
                };

                if (info.type === AttributeType.Input) {
                    return <>
                        <Form.Item {...props} >
                            <Input placeholder={`input ${info.name}`} />
                        </Form.Item>
                    </>
                }
                else if (info.type === AttributeType.Selection && info.selections) {
                    return <>
                        <Form.Item {...props} >
                            <Select>
                                {(info.selections).map(opt => <Select.Option key={`${node.id}-${fieldName}-${opt}`} value={opt}>{opt}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </>
                }
                else if (info.type === AttributeType.CheckBox) {
                    return <>
                        <Form.Item {...props} valuePropName="checked">
                            <Checkbox defaultChecked={true} />
                        </Form.Item>
                    </>
                }
                else if (info.type === AttributeType.TextArea) {
                    return <>
                        <Form.Item {...props}>
                            <TextArea rows={4} />
                        </Form.Item>
                    </>
                }
                else if (info.type === AttributeType.ListObject && info.children) {
                    return <>
                        {AdditionalInfoList(info.name, info.name, info.children)}
                    </>
                }
                return <></>
            })}
        </Form>
    </Modal>
}
