
import { FC, useEffect, useRef, useState } from "react";
import { Form, Input, Select, Modal, Checkbox } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { GnomonNode, NodeData } from "../../../model";
import { AdditionalInfoType, getAdditionalInfo, getBasicInfo } from './node';

const { TextArea } = Input;

interface NodeModalProps {
    node: GnomonNode,
    isModalOpen: boolean,
    handleOk: (data: GnomonNode) => void,
    toggleVisible: VoidFunction
}


export const NodeModalComponent: FC<NodeModalProps> = ({ isModalOpen, toggleVisible, handleOk, node }) => {
    const [form] = Form.useForm();

    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(node.data);
    }, [node, form, isModalOpen]);

    return <Modal
        forceRender
        title={
            <div
                style={{
                    width: '100%',
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
        }
        modalRender={(modal) => (
            <Draggable
                disabled={disabled}
                bounds={bounds}
                onStart={(event, uiData) => onStart(event, uiData)}
            >
                <div ref={draggleRef}>{modal}</div>
            </Draggable>
        )}
        open={isModalOpen}
        onOk={() => {
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
        }}
        onCancel={toggleVisible}>
        <Form
            autoComplete="off"
            form={form}>
            {getBasicInfo().concat(getAdditionalInfo(node.data.nodeType)).map(info => {
                if (info.type === AdditionalInfoType.Input) {
                    return <>
                        <Form.Item key={info.name} label={info.name} name={info.name.toLowerCase()} rules={[{ required: info.required, message: `Please input your ${info.name}` }]}>
                            <Input placeholder={`input ${info.name}`} />
                        </Form.Item>
                    </>
                }
                else if (info.type === AdditionalInfoType.Selection) {
                    return <>
                        <Form.Item key={info.name} label={info.name} name={info.name.toLowerCase()} rules={[{ required: info.required, message: `Please input your ${info.name}` }]}>
                            <Select>
                                {(info.selections as string[]).map(node => <Select.Option key={`${info.name}-${node}`} value={node}>{node}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </>
                }
                else if (info.type === AdditionalInfoType.CheckBox) {
                    return <>
                        <Form.Item key={info.name} label={info.name} name={info.name.toLowerCase()} valuePropName="checked">
                            <Checkbox defaultChecked={info.default as boolean} />
                        </Form.Item>
                    </>
                }
                else if (info.type === AdditionalInfoType.TextArea) {
                    return <>
                        <Form.Item key={info.name} label={info.name} name={info.name.toLowerCase()}>
                            <TextArea rows={4} />
                        </Form.Item>
                    </>
                }
                return <></>
            })
            }
        </Form>
    </Modal>
}