import { FC, useEffect, useState } from "react";
import { Button, Checkbox, Divider, Form, FormListFieldData, Input, Modal, message, Radio, Select, Space, Tabs } from "antd";
import { NodeTypeMeta, AttributeType, FunctionalTypeEnum } from "../../model";
import { IoAddSharp } from 'react-icons/io5';
import { FormInstance, useForm } from "antd/es/form/Form";
import {
    MinusCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';


import { useCreateMetaMutation, useDeleteMetaMutation, useUpdateMetaMutation } from "../../service";

import './meta.node.component.scss';
import { ICONS } from "../shared";
// default values
// nodeType: NodeType,
// label: string,
// description?: string,
// owner?: string;
// redirect?: string;
// reposiotry?: string;



/* name path 
- root
    - children
        - 0
            - name
            - type
            - required
            - property

*/
const ObjectFormList = (form: FormInstance<any>, parentKey: number) => (
    <Form.List name={[parentKey, `children`]}>
        {(objectListFormfields, { add: AddObjectField, remove: RemoveObjectField }) => (
            <>
                {objectListFormfields.map((objectListField) => {
                    return (
                        <Space className="field-container" key={objectListField.key} align='start'>

                            <Form.Item name={[objectListField.name, 'name']} label='Name' rules={[{ required: true, message: `Please input your name` }]}>
                                <Input placeholder={`input Name`} />
                            </Form.Item>

                            <Form.Item name={[objectListField.name, 'type']} label='Type' style={{ width: '300px' }} wrapperCol={{ span: 20 }} rules={[{ required: true, message: `Please input your type` }]}>
                                <Select>
                                    {/* Object cannnot have text area or object */}
                                    {[AttributeType.Input, AttributeType.CheckBox].map((opt) => <Select.Option key={`${opt}`} value={opt}>{opt}</Select.Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item name={[objectListField.name, 'required']} label='Required' valuePropName="checked" rules={[{ required: true, message: `Please input your Required` }]}>
                                <Checkbox />
                            </Form.Item>

                            <Form.Item name={[objectListField.name, 'property']} label='Property' >
                                <Input placeholder={`input Property`} />
                            </Form.Item>

                            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => {
                                return (!!!prevValues.attributes[parentKey]?.children && !!curValues.attributes[parentKey]?.children) ||
                                    prevValues.attributes[parentKey]?.children[objectListField.name]?.type !== curValues.attributes[parentKey]?.children[objectListField.name]?.type
                            }}>
                                {() => {
                                    const v = form.getFieldValue(['attributes', parentKey, 'children', objectListField.name, 'type']) as AttributeType;
                                    switch (v) {
                                        case AttributeType.Input:
                                            return (
                                                <Form.Item name={[objectListField.name, 'default']} label='Default' >
                                                    <Input />
                                                </Form.Item>
                                            )
                                        case AttributeType.CheckBox:
                                            return (
                                                <Form.Item style={{ width: '150px' }} name={[objectListField.name, 'default']} label='Default' >
                                                    <Select>
                                                        {['true', 'false'].map((opt) => <Select.Option key={`${opt}`} value={opt}>{opt}</Select.Option>)}
                                                    </Select>
                                                </Form.Item>
                                            )
                                        default:
                                            return <>
                                            </>
                                    }
                                }}
                            </Form.Item>

                            <MinusCircleOutlined style={{ margin: '8px 0 0 0' }} onClick={() => RemoveObjectField(objectListField.name)} />
                        </Space>
                    )
                })}

                <Form.Item>
                    <Button type="dashed" className='AddField' onClick={() => AddObjectField()} block icon={<PlusOutlined />}>
                        Add Field
                    </Button>
                </Form.Item>
            </>
        )}
    </Form.List>
)

/* name path 
- root
    - icon
    - name
    - attributes
        - 0
        - name
        - type
        - required
        - property
        - children
            - 0
                - name
                - type
                - required
                - property

*/


const SelectFormList = (field: FormListFieldData) => (
    <Form.List
        name={[field.name, 'selections']}
        rules={[
            {
                validator: async (_, names) => {
                    if (!names || names.length < 2) {
                        return Promise.reject(new Error('At least 2 selections'));
                    }
                },
            },
        ]} >
        {(subFields, { add, remove }, { errors }) => (
            <>
                {subFields.map((subField) => (
                    <Form.Item
                        required={false}
                        key={subField.key}>
                        <Form.Item
                            {...subField}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Please input selections or delete this field.",
                                },
                            ]}
                            noStyle>
                            <Input placeholder="input your selection" style={{ width: '60%' }} />
                        </Form.Item>
                        {subFields.length > 1 && <DeleteOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(subField.name)} />}
                    </Form.Item>
                ))}
                <Form.Item>
                    <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '60%' }}
                        icon={<PlusOutlined />} >
                        Add Option
                    </Button>
                    <Form.ErrorList errors={errors} />
                </Form.Item>
            </>
        )}
    </Form.List>
)

const NodeTypeMetaContent: FC<{ item: NodeTypeMeta }> = ({ item }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = useForm();
    const [editable, setEditable] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [createMeta] = useCreateMetaMutation();
    const [updateMeta] = useUpdateMetaMutation();
    const [deleteMeta] = useDeleteMetaMutation();

    useEffect(() => {
        if (item.name === 'TO_BE_REPLACED') {
            form.resetFields();
        }
    }, [form, item])
    return <>
        {contextHolder}
        <Form
            disabled={!editable}
            initialValues={item}
            className="meta-attribute-container"
            autoComplete="off"
            onFinish={e => {
                form.validateFields().then(v => {
                    const toBeSaved = Object.assign({}, item, { ...(v as object) });
                    if (!!!toBeSaved._id) {
                        createMeta({ meta: toBeSaved });
                        messageApi.success('create node type successfully');
                    } else {
                        updateMeta({ meta: toBeSaved })
                        messageApi.success('update node type successfully');
                    }
                });
            }}
            form={form}>

            <Form.Item name='name' label='Name' labelCol={{ span: 2 }} wrapperCol={{ span: 4 }} rules={[{ required: true, message: `Please input your name` }]}>
                <Input placeholder={`input Name`} />
            </Form.Item>
            <Form.Item name='icon' label='Icons' labelCol={{ span: 2 }} wrapperCol={{ span: 4 }} rules={[{ required: true, message: `Please select` }]}>
                <Select>
                    {ICONS.map((opt, idx) => <Select.Option key={`${idx}`} value={idx}>{opt}</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item name='functionalType' labelCol={{ span: 2 }} wrapperCol={{ span: 4 }} label="Functional Type" rules={[{ required: true, message: `Please select` }]}>
                <Radio.Group>
                    <Radio value="Processor"> Processor </Radio>
                    <Radio value="Storage"> Storage </Radio>
                    <Radio value="External"> External </Radio>
                </Radio.Group>
            </Form.Item>

            <Divider >Attributes</Divider>
            <Form.List name={`attributes`}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field) => {

                            return (
                                <Space className="field-container" key={field.key}>
                                    <Modal centered forceRender keyboard open={modalOpen} width={'80vw'} onCancel={() => setModalOpen(!modalOpen)} onOk={() => { setModalOpen(!modalOpen) }}>
                                        {ObjectFormList(form, field.name)}
                                    </Modal>

                                    <Form.Item name={[field.name, 'name']} label='Name' rules={[{ required: true, message: `Please input your name` }]}>
                                        <Input placeholder={`input Name`} />
                                    </Form.Item>

                                    <Form.Item name={[field.name, 'type']} label='Type' style={{ width: '300px' }} wrapperCol={{ span: 20 }} rules={[{ required: true, message: `Please input your type` }]}>
                                        <Select>
                                            {Object.entries(AttributeType).map(([opt]) => <Select.Option key={`${opt}`} value={opt}>{opt}</Select.Option>)}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name={[field.name, 'required']} label='Required' valuePropName="checked" rules={[{ required: true, message: `Please input your Required` }]}>
                                        <Checkbox />
                                    </Form.Item>

                                    <Form.Item name={[field.name, 'property']} label='Property' >
                                        <Input placeholder={`input Property`} />
                                    </Form.Item>

                                    <Form.Item noStyle shouldUpdate={(prevValues, curValues) =>
                                        prevValues.attributes[field.name]?.type !== curValues.attributes[field.name]?.type || prevValues.attributes[field.name]?.selections !== curValues.attributes[field.name]?.selections
                                    }>
                                        {() => {
                                            const v = form.getFieldValue(['attributes', field.name, 'type']) as AttributeType;
                                            switch (v) {
                                                case AttributeType.Input:
                                                case AttributeType.TextArea:
                                                    return (
                                                        <Form.Item name={[field.name, 'default']} label='Default' >
                                                            <Input />
                                                        </Form.Item>
                                                    )
                                                case AttributeType.CheckBox:
                                                    return (
                                                        <Form.Item style={{ width: '150px' }} name={[field.name, 'default']} label='Default' >
                                                            <Select>
                                                                {['true', 'false'].map((opt) => <Select.Option key={`${opt}`} value={opt}>{opt}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    )
                                                case AttributeType.Selection:
                                                    return (
                                                        <Form.Item style={{ width: '300px' }} name={[field.name, 'default']} label='Default' >
                                                            <Select>
                                                                {(form.getFieldValue(['attributes', field.name, 'selections']) as string[] || []).map((opt) => <Select.Option key={`${opt}`} value={opt}>{opt}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    )
                                                default:
                                                    return <>
                                                    </>
                                            }
                                        }}
                                    </Form.Item>

                                    <Form.Item noStyle shouldUpdate={(prevValues, curValues) =>
                                        prevValues.attributes[field.name]?.type !== curValues.attributes[field.name]?.type
                                    }>
                                        {() => {
                                            const v = form.getFieldValue(['attributes', field.name, 'type']) as AttributeType;
                                            if (v === AttributeType.Selection) {
                                                return SelectFormList(field);
                                            } else if (v === AttributeType.ListObject) {
                                                return <EditOutlined onClick={e => setModalOpen(!modalOpen)} />
                                            }
                                            return <></>
                                        }}

                                    </Form.Item>

                                    <MinusCircleOutlined style={{ margin: '8px 0 0 0' }} onClick={() => remove(field.name)} />
                                </Space>
                            )
                        })}

                        <Form.Item>
                            <Button type="dashed" className='AddField' onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Field
                            </Button>
                        </Form.Item>

                    </>
                )}
            </Form.List>

            <Space>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={() => {
                        deleteMeta({ meta: item });
                        messageApi.success('delete node type successfully');
                    }} >
                        Delete
                    </Button>
                </Form.Item>
            </Space>
        </Form>

        <Button type="primary" onClick={() => setEditable(!editable)} >
            Edit
        </Button>
    </>
}

export const NodeTypeTab: FC<{ items: NodeTypeMeta[] }> = ({ items }) => {
    const [createMeta] = useCreateMetaMutation();

    return (
        <Tabs
            tabBarExtraContent={<IoAddSharp onClick={() => {
                createMeta({
                    meta: {
                        name: 'TO_BE_REPLACED',
                        functionalType: FunctionalTypeEnum.Processor,
                        attributes: [],
                        icon: 0,
                    }
                })
            }} />}
            defaultActiveKey="1"
            tabPosition='left'
            style={{ height: '100%' }}
            items={[...items].sort((left, right) => left.name.localeCompare(right.name)).map((item, idx) => {
                return {
                    label: item.name,
                    key: `${idx + 1}`,
                    children: <NodeTypeMetaContent key={item.name} item={item} />
                };
            })}
        />
    )
}