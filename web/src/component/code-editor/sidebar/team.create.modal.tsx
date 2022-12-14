
import { FC } from "react"
import { Form, Input, Modal } from 'antd';
import utils from "../../shared/util";
import { Team } from "../../../model";

interface TeamCreateModalProps {
    isModalOpen: boolean;
    handleOk: (team: Team) => void
    toggleVisible: VoidFunction
    activeTeam?: Team
}

export const TeamCreateModal: FC<TeamCreateModalProps> = ({ activeTeam, isModalOpen, handleOk, toggleVisible }) => {
    const [form] = Form.useForm();
    return <>
        <Modal title="Team Info"
            open={isModalOpen}
            onCancel={toggleVisible}
            onOk={() => {
                form.validateFields().then(values => {
                    if (!activeTeam) {
                        handleOk(Object.assign({}, values, {
                            id: utils.newUUID()
                        }));
                    } else {
                        handleOk(Object.assign({}, activeTeam, {
                            ...values
                        }));
                    }
                })
            }}>
            <Form
                onLoadedData={e => {
                    if (activeTeam) {
                        form.resetFields();
                        form.setFieldsValue(activeTeam);
                    } else {
                        form.resetFields();
                    }
                }}
                form={form}
                name="team-info"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input your description!' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    </>
}