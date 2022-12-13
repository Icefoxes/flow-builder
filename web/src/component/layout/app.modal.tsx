import { Modal, Button } from "antd"
import { FC } from "react"

interface AboutModalProps {
    isModalOpen: boolean;
    handleOk: VoidFunction
}

export const AboutModal: FC<AboutModalProps> = ({ isModalOpen, handleOk }) => {
    return <>
        <Modal title="About" open={isModalOpen} footer={[
            <Button key="back" onClick={handleOk}>
                OK
            </Button>]}>
            <p>Version: '0.1'</p>

            <p>Copyright @2022</p>
        </Modal>
    </>
}