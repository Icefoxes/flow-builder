import { FC, useState } from "react"
import { useContextMenu } from "react-contexify";
import { message, Modal, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { FcFolder, FcBriefcase, FcBarChart } from 'react-icons/fc';
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import './sidebar.component.scss';

import { FlowContextMenu, FlowContextMenuType, FLOW_SIDEBAR_MENU } from "./sidebar.flow.context-menu";
import { TeamContextMenu, TeamContextMenuType, TEAM_SIDEBAR_MENU } from "./sidebar.team.context-menu";
import { TeamCreateModal } from "./team.create.modal";

import { useLazyGetFlowByIdQuery } from "../../../service";

import { Flow, FlowInfo, FlowLight, Team } from "../../../model";
import utils from "../../shared/util";


// --team
//     -- tag
//         -- flow
interface EditorSidebarProps {
    teams: Team[];
    flows: FlowLight[];
    activeFlow: Flow | null;

    createTeam: (team: Team) => void;
    updateTeam: (team: Team) => void;
    deleteTeam: (teamId: string) => void;
    createFlow: (flow: FlowInfo) => void,
    deleteFlow: (flowId: string) => void,
}

interface EditorSidebarModalState {
    activeTeam: Team | null,
    teamCreateModalVisible: boolean;
}

export const EditorSidebarComponent: FC<EditorSidebarProps> = ({ teams, flows, activeFlow, createTeam, updateTeam, deleteTeam, createFlow, deleteFlow }) => {
    const navigate = useNavigate();
    // serivce


    const [getFlowById] = useLazyGetFlowByIdQuery();
    // menu
    const { show: showFlowContextMenu } = useContextMenu({
        id: FLOW_SIDEBAR_MENU
    });

    const { show: showTeamContextMenu } = useContextMenu({
        id: TEAM_SIDEBAR_MENU
    });

    // state
    const [modalState, setModalState] = useState<EditorSidebarModalState>({
        activeTeam: null,
        teamCreateModalVisible: false
    });

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        // TODO
        // console.log('selected', selectedKeys, info);
    };

    const onFlowContextMenu = (item: FlowContextMenuType, props?: any) => {
        const flow = props as FlowLight;
        switch (item) {
            case FlowContextMenuType.EditFlow: {
                if (!!!activeFlow || (activeFlow._id !== flow._id)) {
                    getFlowById({ id: flow._id }) // ==> setActiveFlow ==> Show on Editor
                }
                break;
            }
            case FlowContextMenuType.DeleteFlow: {
                Modal.confirm({
                    title: 'Confirm',
                    icon: <ExclamationCircleOutlined />,
                    content: 'Do you want to delete this flow',
                    okText: 'Confirm',
                    cancelText: 'Cancel',
                    onOk: () => {
                        deleteFlow(flow._id);
                        message.success(`deleted flow ${flow.name}`);
                    }
                });
                break;
            }
            case FlowContextMenuType.CopyFlow: {
                getFlowById({ id: flow._id }).unwrap().then(data => {
                    let text = JSON.stringify(data);
                    data?.nodes.forEach(n => {
                        const id = utils.newUUID();
                        text = text.replaceAll(n.id, id);
                    });
                    const copiedFlow = JSON.parse(text) as Flow;
                    const { _id, tag, doc, ...restProps } = copiedFlow
                    // copy teamId + nodes + edges + extensions, do not copy _id, doc, tag, alias and name
                    createFlow(Object.assign({}, restProps, {
                        alias: utils.newUUID(),
                        name: 'TO_BE_REPLACED',
                    }));
                })
                break;
            }
        }
    }

    const onTeamContextMenu = (item: TeamContextMenuType, props?: any) => {
        switch (item) {
            case TeamContextMenuType.AddTeam: {
                setModalState({
                    activeTeam: null,
                    teamCreateModalVisible: true
                });
                break;
            }
            case TeamContextMenuType.AddFlow: {
                const { _id: teamId } = props;
                createFlow(utils.newFlow(teamId));
                break;
            }
            case TeamContextMenuType.DeleteTeam: {
                const team = props as Team;
                const flowsNotDeleted = flows.find(f => f.teamId === team._id);
                if (flowsNotDeleted) {
                    message.error(`please delete all flows under ${team.name} first`);
                    return;
                }
                Modal.confirm({
                    title: 'Confirm',
                    icon: <ExclamationCircleOutlined />,
                    content: 'Do you want to delete this team',
                    okText: 'Confirm',
                    cancelText: 'Cancel',
                    onOk: () => {
                        deleteTeam(team._id);
                        message.success(`deleted team ${team.name}`);
                    }
                });
                break;
            }
            case TeamContextMenuType.EditTeam: {
                const team = props as Team;
                setModalState({
                    activeTeam: team,
                    teamCreateModalVisible: true
                });
                break;
            }
            case TeamContextMenuType.EditMeta: {
                navigate('/meta');
                break;
            }
        }
    }


    const onTeamCreateModal = (team: Team) => {
        if (team._id) {
            updateTeam(team);
        } else {
            createTeam(team);
        }
        setModalState(Object.assign({}, modalState, {
            teamCreateModalVisible: false
        }));
    }

    const generateTreeData = () => {
        return teams.map(team => {
            const tags = Array.from(new Set(flows.filter(flow => flow.tag && flow.teamId === team._id).map(flow => flow.tag)));
            return {
                title: () => <div className="gnomon-tree-node" onContextMenu={e => {
                    showTeamContextMenu({
                        event: e,
                        props: { source: 'tree', ...team }
                    });
                    e.stopPropagation();
                }}>
                    <FcFolder className="prefix" />   {team.name}
                </div>,
                key: `${team._id}`,
                isLeaf: false,
                children: [...[...flows.filter(flow => !!!flow.tag && flow.teamId === team._id)].sort((prev, next) => prev.name.localeCompare(next.name)).map(flow => {
                    return {
                        title: () => <div className="gnomon-tree-node"
                            onDoubleClick={() => {
                                if (!!!activeFlow || (activeFlow._id !== flow._id)) {
                                    getFlowById({ id: flow._id }) // ==> setActiveFlow ==> Show on Editor
                                }
                            }}
                            onContextMenu={e => {
                                showFlowContextMenu({
                                    event: e,
                                    props: flow
                                });
                                e.stopPropagation();
                            }}>
                            <FcBarChart className="prefix" /> {flow.name}
                        </div>,
                        key: `${flow._id}`,
                        isLeaf: true
                    } as DataNode
                }), ...tags.sort().map(tag => {
                    return {
                        title: () => <div className="gnomon-tree-node">
                            <FcBriefcase className="prefix" /> {tag}
                        </div>,
                        key: `${team._id}-${tag}`,
                        isLeaf: false,
                        children: [...[...flows.filter(flow => flow.tag === tag && flow.teamId === team._id)].sort((prev, next) => prev.name.localeCompare(next.name)).map(flow => {
                            return {
                                title: () => <div className="gnomon-tree-node"
                                    onDoubleClick={() => {
                                        if (!!!activeFlow || (activeFlow._id !== flow._id)) {
                                            getFlowById({ id: flow._id }) // ==> setActiveFlow ==> Show on Editor
                                        }
                                    }}
                                    onContextMenu={e => {
                                        showFlowContextMenu({
                                            event: e,
                                            props: flow
                                        });
                                        e.stopPropagation();
                                    }}>
                                    <FcBarChart className="prefix" /> {flow.name}
                                </div>,
                                key: `${flow._id}`,
                                isLeaf: true
                            } as DataNode
                        })]
                    } as DataNode
                })]
            } as DataNode
        });
    }

    return <>
        <Tree
            className="gnomon-tree"
            style={{ width: '100%', height: '100%', padding: '10px' }}
            onSelect={onSelect}
            treeData={generateTreeData()}
        />
        <FlowContextMenu onItemClick={onFlowContextMenu} />
        <TeamContextMenu onItemClick={onTeamContextMenu} />
        <TeamCreateModal
            activeTeam={modalState.activeTeam}
            handleOk={onTeamCreateModal}
            isModalOpen={modalState.teamCreateModalVisible}
            toggleVisible={() => setModalState(Object.assign({}, modalState, {
                teamCreateModalVisible: !modalState.teamCreateModalVisible
            }))} />
    </>
}