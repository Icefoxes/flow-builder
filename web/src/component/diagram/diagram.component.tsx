
import { FC, useCallback, useState } from "react"
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    // useReactFlow,
    Node,
    NodeMouseHandler,
    EdgeMouseHandler,
} from 'reactflow';
import { useContextMenu } from "react-contexify";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import {
    LayoutOutlined,
} from '@ant-design/icons';
import { useDispatch } from "react-redux";
import 'reactflow/dist/style.css';
import './diagram.component.scss';
import { NodeConfig, UserDefinedNode } from "./node";
import { ChangeNodeProps, NodeContextMenuType, DeleteNodeProps, NODE_MENU_ID, NodeContextMenu } from './node/node.context-menu';
import { UserDefinedEdge } from "./edge";
import { DeleteEdgeProps, EdgeContextMenu, EdgeContextMenuType, EDGE_MENU_ID } from "./edge/edge.context-menu";
import { Flow, GnomonNode, NodeType } from "../../model";

import Utils from '../shared/util';
import { ControlType, DiagramToolBarComponent } from "./toolbar/diagram.toolbar";
import { setActiveFlow } from '../../feature/admin/adminSlice';
import { NodeModalComponent } from "./node/node.modal";
import { ELKLayout } from "./elk";



const nodeTypes = {
    gnomon: UserDefinedNode
}

const edgeTypes = {
    gnomon: UserDefinedEdge
}



export const DiagramComponent: FC<{
    flow: Flow,
    onSave: (flow: Flow) => void,
}> = ({ flow, onSave }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const reactFlowInstance = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);

    const [editNode, setEditNode] = useState<GnomonNode | null>(null);
    const [editNodeVisible, setEditNodeVisible] = useState(false);
    const { show: showNodeContextMenu } = useContextMenu({
        id: NODE_MENU_ID
    });
    const { show: showEdgeContextMenu } = useContextMenu({
        id: EDGE_MENU_ID
    });

    const onConnect = useCallback((params: any) => setEdges((eds) => {
        return addEdge(Object.assign({}, params, {
            type: 'gnomon',
            id: `edge-${params.source}-${params.target}`
        }), eds);
    }), [setEdges]);

    const onContorlButtonClick = (control: ControlType) => {
        const updatedFlow = Utils.transformFlowLight(nodes, edges, flow);
        if (control === ControlType.Save) {
            onSave(updatedFlow);
            messageApi.success('Saved Flow')
        } else if (control === ControlType.Edit) {
            dispatch(setActiveFlow(updatedFlow));
            navigate('/editor');
        }
    }
    const onEdgeContextMenuClick = (control: EdgeContextMenuType, props: any) => {
        if (control === EdgeContextMenuType.Delete) {
            const deleteProps = props as DeleteEdgeProps;
            setEdges([...edges.filter(edge => edge.id !== deleteProps.id)]);
        }
    }
    const onNodeContextMenuItemClick = (control: NodeContextMenuType, props: any) => {
        if (control === NodeContextMenuType.Create) {
            const id = Utils.newUUID();
            const node: GnomonNode = {
                id: id,
                data: {
                    label: 'New node',
                    nodeType: NodeType.Kafka
                },
                position: {
                    x: Math.max(...nodes.map(node => node.position.x)) + NodeConfig.Width + NodeConfig.NodeSpace,
                    y: Math.max(...nodes.map(node => node.position.y)),
                },
                type: 'gnomon'
            } as GnomonNode;
            setNodes([...nodes, node]);
        }
        // change node type
        else if (control === NodeContextMenuType.ChangeType) {
            const data = props as ChangeNodeProps;
            const found = nodes.find(node => node.id === data.id) as Node;
            setNodes([...nodes.filter(node => node.id !== data.id), Object.assign({}, found, {
                data: Object.assign({}, found.data, {
                    nodeType: data.type
                })
            })]);
        }
        // delete node
        else if (control === NodeContextMenuType.Delete) {
            const data = props as DeleteNodeProps;
            setNodes([...nodes.filter(node => node.id !== data.id)]);
            setEdges([...edges.filter(edge => edge.source !== data.id && edge.target !== data.id)]);
        }
        else if (control === NodeContextMenuType.Edit) {
            const node = props as GnomonNode;
            setEditNode(node);
            setEditNodeVisible(true);
        }
    }

    const onNodeClick: NodeMouseHandler = (e) => {
        const id = (e.target as HTMLElement).getAttribute("data-id");
        const find = nodes.find(node => node.id === id);
        if (find) {
        }
    }

    const onNodeContextMenu: NodeMouseHandler = (e) => {
        const id = (e.target as HTMLElement).getAttribute("data-id");
        const find = nodes.find(node => node.id === id);
        if (find) {
            showNodeContextMenu({
                event: e,
                props: find
            });
        }
    }

    const onEdgeContextMenu: EdgeMouseHandler = (e) => {
        const id = Utils.findEdgeId(e.target);
        if (!!!id) {
            return;
        }
        const found = edges.find(e => e.id === id);
        if (!!!found) {
            return;
        }
        showEdgeContextMenu({
            event: e,
            props: found
        })
    }
    const onLayout = () => {
        ELKLayout(nodes, edges).then(v => setNodes(v));
    }
    const LayoutControlButton = <LayoutOutlined style={{ width: '100%', height: '100%' }} onClick={onLayout} />

    return <div className="diagram-container" >
        {contextHolder}

        <DiagramToolBarComponent onClick={onContorlButtonClick} />

        <ReactFlow
            fitView
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            edgeTypes={edgeTypes}
            onNodeClick={onNodeClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}>
            <Controls>
                {LayoutControlButton}
            </Controls>
            <Background />
        </ReactFlow>
        <NodeContextMenu onItemClick={onNodeContextMenuItemClick} />
        <EdgeContextMenu onItemClick={onEdgeContextMenuClick} />
        {editNode && <NodeModalComponent
            node={editNode}
            isModalOpen={editNodeVisible}
            toggleVisible={() => setEditNodeVisible(!editNodeVisible)}
            handleOk={(event) => setNodes([...nodes.filter(node => node.id !== event.id), event])} />}
    </div>
}