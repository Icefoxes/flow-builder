import { FC } from "react"
import { Layout, Menu } from 'antd';
import {
    ControlOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    EditOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FcStumbleupon } from 'react-icons/fc';
import './app-sidebar.scss';

const { Sider } = Layout;

export const AppSidebar: FC<{ collapsed: boolean }> = ({ collapsed }) => {

    return <>
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo-container">
                <FcStumbleupon className="logo" />
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                    {
                        key: '1',
                        icon: <Link to=''><ControlOutlined /></Link>,
                        children: [
                            {
                                key: '1-1',
                                icon: <Link to='editor'><EditOutlined /></Link>,
                                label: 'Flow Editor'
                            },
                            {
                                key: '1-2',
                                icon: <Link to='code'><VideoCameraOutlined /></Link>,
                                label: 'Flow Code',
                            },
                        ],
                        label: 'Flow Builder',
                    },
                    {
                        key: '3',
                        icon: <Link to='team'><UploadOutlined /></Link>,
                        label: 'Flow Viwer',
                    },
                ]}
            />
        </Sider>
    </>
}