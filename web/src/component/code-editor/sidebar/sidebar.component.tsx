import { FC, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useContextMenu } from "react-contexify";
import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { useNavigate } from "react-router-dom";
import { FcFolder, FcBriefcase, FcBarChart } from 'react-icons/fc';

import './sidebar.component.scss';

import { FlowContextMenu, FlowContextMenuType, FLOW_SIDEBAR_MENU } from "./sidebar.flow.context-menu";
import { TeamContextMenu, TeamContextMenuType, TEAM_SIDEBAR_MENU } from "./sidebar.team.context-menu";
import { TeamCreateModal } from "./team.create.modal";

import { useCreateFlowMutation, useCreateTeamMutation, useLazyGetFlowsByTeamQuery } from "../../../service";
import { setActiveFlow } from "../../../feature/admin/adminSlice";

import { Flow, Team } from "../../../model";
import utils from "../../shared/util";


// --team
//     -- tag
//         -- flow
interface EditorSidebarProps {
    teams: Team[]
}

const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
    list.map((node) => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });


export const EditorSidebarComponent: FC<EditorSidebarProps> = ({ teams }) => {
    // hooks
    const navigation = useNavigate();
    const dispatch = useDispatch();
    // data
    const [getFlowsByTeam] = useLazyGetFlowsByTeamQuery();
    const [createTeam] = useCreateTeamMutation();
    const [createFlow] = useCreateFlowMutation();

    // menu
    const { show: showFlowContextMenu } = useContextMenu({
        id: FLOW_SIDEBAR_MENU
    });

    const { show: showTeamContextMenu } = useContextMenu({
        id: TEAM_SIDEBAR_MENU
    });

    // state
    const [teamCreateVisible, setTeamCreateVisible] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<DataNode[]>([]);

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        // TODO
        console.log('selected', selectedKeys, info);
    };

    const onLoadData = ({ key, children }: any) =>
        new Promise<void>((resolve) => {
            if (children) {
                resolve();
                return;
            }

            getFlowsByTeam({ id: key }).unwrap().then(flows => {
                setTreeData((origin) => {
                    const tags = Array.from(new Set(flows.filter(flow => flow.tag).map(flow => flow.tag)));
                    return updateTreeData(origin, key, [...tags.sort().map(tag => {
                        return {
                            title: () => <div className="gnomon-tree-node">
                                <FcBriefcase className="prefix" /> {tag}
                            </div>,
                            key: `${key}-${tag}`,
                            isLeaf: false,
                            children: [...flows.filter(flow => flow.tag === tag).map(flow => {
                                return {
                                    title: () => <div className="gnomon-tree-node" onContextMenu={e => {
                                        showFlowContextMenu({
                                            event: e,
                                            props: flow
                                        });
                                    }}>
                                        <FcBarChart className="prefix" /> {flow.name}
                                    </div>,
                                    key: `${key}-${tag}-${flow.name}`,
                                    isLeaf: true
                                } as DataNode
                            })]
                        } as DataNode
                    })]
                    );
                })
            })

            resolve()
        });


    const onFlowContextMenu = (item: FlowContextMenuType, props?: any) => {
        if (item === FlowContextMenuType.Edit) {
            const flow = props as Flow;
            dispatch(setActiveFlow(flow));
            return;
        } else if (item === FlowContextMenuType.Open) {
            const flow = props as Flow;
            navigation(`teams/${flow.team}/flows/${flow.id}`);
        }
    }

    const onTeamContextMenu = (item: TeamContextMenuType, props?: any) => {
        if (item === TeamContextMenuType.AddTeam) {
            setTeamCreateVisible(true);
            return;
        }
        else if (item === TeamContextMenuType.AddFlow) {
            const { id } = props;
            createFlow({ flow: utils.newFlow(id) });
        }
    }

    useEffect(() => {
        const nodes = teams.map(team => {
            return {
                title: () => <div className="gnomon-tree-node" onContextMenu={e => {
                    showTeamContextMenu({
                        event: e,
                        props: { id: team.id, source: 'tree' }
                    })
                }}>
                    <FcFolder className="prefix" />   {team.name}
                </div>,
                key: `${team.id}`,
                isLeaf: false
            } as DataNode
        });
        setTreeData(nodes);
    }, [teams])

    return <>
        <Tree
            className="gnomon-tree"
            style={{ width: '100%', height: '100%', padding: '10px' }}
            onSelect={onSelect}
            loadData={onLoadData}
            treeData={treeData}
        />
        <FlowContextMenu onItemClick={onFlowContextMenu} />
        <TeamContextMenu onItemClick={onTeamContextMenu} />
        <TeamCreateModal isModalOpen={teamCreateVisible} handleOk={team => {
            createTeam(team);
            setTeamCreateVisible(false);
        }} />
    </>
}