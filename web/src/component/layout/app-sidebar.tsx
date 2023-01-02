import { FC } from "react"
import { Layout, Menu } from 'antd';
import {
    ControlOutlined,
    AimOutlined,
    BuildOutlined,
    BorderlessTableOutlined,
    BankOutlined,
    DatabaseOutlined,
    DeploymentUnitOutlined,
    FieldTimeOutlined,
    GatewayOutlined,
    HddOutlined,
    GroupOutlined,
} from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { FcStumbleupon } from 'react-icons/fc';

import './app-sidebar.scss';

import { selectFlows, selectTeams } from "../../feature/admin/adminSlice";
import { ItemType } from "antd/es/menu/hooks/useItems";

const { Sider } = Layout;

const ICONS = [<AimOutlined />, <BuildOutlined />, <BorderlessTableOutlined />, <BankOutlined />, <DatabaseOutlined />, <DeploymentUnitOutlined />, <FieldTimeOutlined />, <GatewayOutlined />, <HddOutlined />, <GroupOutlined />]

const RandomInt = (v: string): number => {
    if (v.length === 0) {
        return 0;
    }
    if (v.length < 23 && v.length > 0) {
        return (v.charCodeAt(1)) % ICONS.length
    }
    return (v.charCodeAt(15) + v.charCodeAt(6) + v.charCodeAt(5) + v.charCodeAt(10) + v.charCodeAt(11)) % ICONS.length
}

export const AppSidebar: FC<{ collapsed: boolean }> = ({ collapsed }) => {
    const teams = useSelector(selectTeams);
    const flows = useSelector(selectFlows);
    return (
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
                        label: 'Flow Builder',
                    },
                    ...teams.map(team => {
                        const tags = Array.from(new Set(flows.filter(flow => flow.tag && flow.teamId === team._id).map(flow => flow.tag))) as string[];
                        return {
                            key: `${team._id}`,
                            icon: ICONS[RandomInt(team._id as string)],
                            label: team.name,
                            children: [
                                ...flows.filter(flow => !!!flow.tag && flow.teamId === team._id).map(flow => {
                                    return {
                                        key: `${flow._id}`,
                                        label: flow.name,
                                        icon: <Link to={`/flows/${flow.alias}`}>{ICONS[RandomInt(flow._id)]}</Link>,
                                    }
                                }),
                                ...(tags || []).sort().map(tag => {
                                    return {
                                        key: `${team._id}-${tag}`,
                                        icon: ICONS[RandomInt(tag as string)],
                                        label: `${tag}`,
                                        children: [...flows.filter(flow => flow.tag === tag && flow.teamId === team._id).map(flow => {
                                            return {
                                                key: `${flow._id}`,
                                                label: flow.name,
                                                icon: <Link to={`/flows/${flow.alias}`}>{ICONS[RandomInt(flow._id)]}</Link>,
                                            }
                                        })]
                                    }
                                })
                            ]
                        } as ItemType
                    })
                ]}
            />
        </Sider>
    )
}