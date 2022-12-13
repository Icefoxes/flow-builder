
import { FC } from "react"
import { Form, Input, Modal } from 'antd';
import utils from "../../shared/util";
import { Team } from "../../../model";

interface TeamCreateModalProps {
    isModalOpen: boolean;
    handleOk: (team: Team) => void
}

export const TeamCreateModal: FC<TeamCreateModalProps> = ({ isModalOpen, handleOk }) => {
    const [form] = Form.useForm();
    return <>
        <Modal title="Team Info"
            open={isModalOpen}
            onOk={e => {
                form.validateFields().then(values => {
                    const team = Object.assign({}, values, {
                        id: utils.newUUID()
                    });
                    handleOk(team);
                })
            }}>

            <Form
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