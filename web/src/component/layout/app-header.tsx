import { FC } from "react"
import { Avatar, Badge, Layout } from 'antd';
import React from "react";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import './app-header.scss';

const { Header } = Layout;

interface AppHeaderProps {
    setCollapsed: (v: boolean) => void;
    collapsed: boolean;
    onAboutClick: VoidFunction;
}

export const AppHeader: FC<AppHeaderProps> = ({ setCollapsed, collapsed, onAboutClick }) => {

    return <>
        <Header id="gnomon-header" >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
            })}

            <div className="icon-container">
                <InfoCircleOutlined className="icon" size={40} onClick={onAboutClick} />
                <span className="avatar-item">
                    <Badge count={1}>
                        <Avatar shape="square" icon={<UserOutlined />} />
                    </Badge>
                </span>
            </div>
        </Header>
    </>
}