import { FC, useEffect } from "react";
import { Form, Input, Modal } from 'antd';
import { Edge } from "reactflow";


interface EdgeModalProps {
    activeEdge: Edge,
    isModalOpen: boolean,
    handleOk: (data: Edge) => void,
    toggleVisible: VoidFunction
}


export const EdgeModalComponent: FC<EdgeModalProps> = ({ isModalOpen, toggleVisible, handleOk, activeEdge }) => {
    // hooks
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(activeEdge);
    }, [activeEdge, form, isModalOpen]);

    const onOk = () => {
        form.validateFields()
            .then(data => {
                if (data) {
                    handleOk(Object.assign({}, activeEdge, {
                        ...data
                    }));
                }
                toggleVisible();
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
            form={form}>
            <Form.Item key={'label'} name='label' label='Label' >
                <Input placeholder={`input label`} />
            </Form.Item>
        </Form>
    </Modal>
}
