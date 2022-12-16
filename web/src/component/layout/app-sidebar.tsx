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

const RandomInt = (v: string) => {
    return (v.charCodeAt(3) + v.charCodeAt(4) + v.charCodeAt(5) + v.charCodeAt(6)) % ICONS.length
}

export const AppSidebar: FC<{ collapsed: boolean }> = ({ collapsed }) => {
    const teams = useSelector(selectTeams);
    const flows = useSelector(selectFlows);
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
                        label: 'Flow Builder',
                    },
                    ...teams.map(team => {
                        const tags = Array.from(new Set(flows.filter(flow => flow.tag && flow.team === team.id).map(flow => flow.tag))) as string[];
                        return {
                            key: `${team.id}`,
                            icon: ICONS[RandomInt(team.id)],
                            label: team.name,
                            children: [
                                ...flows.filter(flow => !!!flow.tag && flow.team === team.id).map(flow => {
                                    return {
                                        key: `${flow.id}`,
                                        label: flow.name,
                                        icon: <Link to={`/flows/${flow.id}`}>{ICONS[RandomInt(flow.id)]}</Link>,
                                    }
                                }),
                                ...(tags || []).sort().map(tag => {
                                    return {
                                        key: `${team.id}-${tag}`,
                                        icon: ICONS[RandomInt(tag as string)],
                                        label: `${tag}`,
                                        children: [...flows.filter(flow => flow.tag === tag && flow.team === team.id).map(flow => {
                                            return {
                                                key: `${flow.id}`,
                                                label: flow.name,
                                                icon: <Link to={`/flows/${flow.id}`}>{ICONS[RandomInt(flow.id)]}</Link>,
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
    </>
}