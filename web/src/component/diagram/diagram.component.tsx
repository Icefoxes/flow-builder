import { FC, useCallback, useEffect, useState } from "react"
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    Node,
    NodeMouseHandler,
    EdgeMouseHandler,
    Edge,
} from 'reactflow';
import { useContextMenu } from "react-contexify";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
    ExclamationCircleOutlined,
    ColumnHeightOutlined
} from '@ant-design/icons';
import { useDispatch } from "react-redux";
import 'reactflow/dist/style.css';
import './diagram.component.scss';
import { NodeConfig, UserDefinedNode } from "./node";
import { NodeContextMenuType, ChangeNodeProps, NODE_MENU_ID, NodeContextMenu } from './node/node.context-menu';
import { UserDefinedEdge } from "./edge";
import { DeleteEdgeProps, EdgeContextMenu, EdgeContextMenuType, EDGE_MENU_ID } from "./edge/edge.context-menu";
import { Flow, GnomonNode } from "../../model";

import Utils from '../shared/util';
import { ControlType, DiagramToolBarComponent } from "./toolbar/diagram.toolbar";
import { setActiveFlow } from '../../feature/admin/adminSlice';
import { getDiff, NodeModalComponent } from "./node/node.modal";
import { DiagramContextMenu, DiagramContextMenuType, DIAGRAM_MENU_ID } from "./diagram.context-menu";
import utils from "../shared/util";
import { getDagreLayoutedElements } from "./dagre";



const nodeTypes = {
    gnomon: UserDefinedNode
}

const edgeTypes = {
    gnomon: UserDefinedEdge
}

const newNode = (nodes: Node<any>[], id: string) => {
    const x_max = nodes.length === 0 ? 100 : Math.max(...nodes.map(node => node.position.x));
    const y_max = nodes.length === 0 ? 100 : Math.max(...nodes.map(node => node.position.y));
    return {
        id: id,
        data: {
            label: 'New node',
            nodeType: 'Kafka'
        },
        position: {
            x: x_max + NodeConfig.Width + NodeConfig.NodeSpace,
            y: y_max,
        },
        type: 'gnomon'
    } as GnomonNode;
}

interface EditState {
    nodes: Node<any>[]
    edges: Edge[]
}

const UNDO_CAPICITY = 3;

export const DiagramComponent: FC<{
    flow: Flow,
    onSave: (flow: Flow) => void,
}> = ({ flow, onSave }) => {
    const [messageApi, contextHolder] = message.useMessage();
    // hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const reactFlowInstance = useReactFlow();

    const { nodes: layoutedNodes, edges: layoutedEdges } = getDagreLayoutedElements(
        flow.nodes,
        flow.edges
    );

    // state
    const [undoSnapshot, setUndoSnapshot] = useState<EditState[]>([]);
    const [redoSnapshot, setRedoSnapshot] = useState<EditState[]>([]);
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    const [editNode, setEditNode] = useState<GnomonNode | null>(null);
    const [editNodeVisible, setEditNodeVisible] = useState(false);
    // context menu
    const { show: showNodeContextMenu } = useContextMenu({
        id: NODE_MENU_ID
    });
    const { show: showEdgeContextMenu } = useContextMenu({
        id: EDGE_MENU_ID
    });
    const { show: showDiagramContextMenu } = useContextMenu({
        id: DIAGRAM_MENU_ID
    });

    const makeUndoSnapshot = () => {
        if (undoSnapshot.length >= UNDO_CAPICITY) {
            setUndoSnapshot([...undoSnapshot.slice(1, UNDO_CAPICITY), { nodes, edges }]);
        } else {
            setUndoSnapshot([...undoSnapshot, { nodes, edges }]);
        }
        setRedoSnapshot([]);
    }

    const makeRedoSnapshot = () => {
        if (redoSnapshot.length >= UNDO_CAPICITY) {
            setRedoSnapshot([...redoSnapshot.slice(1, UNDO_CAPICITY), { nodes, edges }]);
        } else {
            setRedoSnapshot([...redoSnapshot, { nodes, edges }]);
        }
    }

    const onConnect = useCallback((params: any) => setEdges((eds) => {
        return addEdge(Object.assign({}, params, {
            type: 'gnomon',
            id: `edge-${params.source}-${params.target}`
        }), eds);
    }), [setEdges]);

    const onContorlButtonClick = (control: ControlType) => {
        const updatedFlow = Utils.transformFlowLight(nodes, edges, flow);
        if (control === ControlType.Save) {
            setRedoSnapshot([]);
            setUndoSnapshot([]);
            onSave(updatedFlow);
            messageApi.success('Saved Flow')
        } else if (control === ControlType.Edit) {
            setRedoSnapshot([]);
            setUndoSnapshot([]);
            dispatch(setActiveFlow(updatedFlow));
            navigate('/');
        } else if (control === ControlType.Undo) {
            const snap = undoSnapshot.pop();
            if (snap) {
                makeRedoSnapshot();
                setNodes(snap.nodes);
                setEdges(snap.edges);
            }
        } else if (control === ControlType.Redo) {
            const snap = redoSnapshot.pop();
            if (snap) {
                setNodes(snap.nodes);
                setEdges(snap.edges);
            }
        }
    }

    const onEdgeContextMenuClick = (control: EdgeContextMenuType, props: any) => {
        if (control === EdgeContextMenuType.Delete) {
            const deleteProps = props as DeleteEdgeProps;
            makeUndoSnapshot();
            setEdges([...edges.filter(edge => edge.id !== deleteProps.id)]);
        }
    }

    const onNodeContextMenuItemClick = (control: NodeContextMenuType, props: any) => {
        if (control === NodeContextMenuType.Create) {
            makeUndoSnapshot();
            const current = props as GnomonNode;
            setNodes([...nodes, Object.assign({}, newNode(nodes, Utils.newUUID()), {
                position: {
                    x: current.position.x,
                    y: current.position.y + 100,
                }
            })]);
        }
        // change node type
        else if (control === NodeContextMenuType.ChangeType) {
            makeUndoSnapshot();
            const data = props as ChangeNodeProps;
            const found = nodes.find(node => node.id === data.id) as Node;
            const diff = getDiff(found.data.nodeType, data.type);
            setNodes([...nodes.filter(node => node.id !== data.id), Object.assign({}, found, {
                data: Object.assign({}, found.data, {
                    nodeType: data.type,
                    ...diff
                })
            })]);
        }
        // delete node
        else if (control === NodeContextMenuType.Delete) {
            const data = props as GnomonNode;
            Modal.confirm({
                title: 'Confirm',
                icon: <ExclamationCircleOutlined />,
                content: 'Do you want to delete this node',
                okText: 'Confirm',
                cancelText: 'Cancel',
                onOk: () => {
                    makeUndoSnapshot();
                    setNodes([...nodes.filter(node => node.id !== data.id)]);
                    setEdges([...edges.filter(edge => edge.source !== data.id && edge.target !== data.id)]);
                    message.success(`deleted ${data.data.label}`);
                }
            });
        }
        else if (control === NodeContextMenuType.Edit) {
            const node = props as GnomonNode;
            setEditNode(node);
            setEditNodeVisible(true);
        }
        else if (control === NodeContextMenuType.Copy) {
            const node = props as GnomonNode;
            makeUndoSnapshot();
            setNodes([...nodes, {
                id: Utils.newUUID(),
                position: {
                    x: node.position.x,
                    y: node.position.y + 100,
                },
                data: node.data,
                type: node.type
            } as Node<any>]);
        }
    }

    const onDiagramContextMenuClick = (item: DiagramContextMenuType) => {
        if (item === DiagramContextMenuType.AddNode) {
            makeUndoSnapshot();
            setNodes([...nodes, newNode(nodes, Utils.newUUID())]);
        }
    }

    const onNodeClick: NodeMouseHandler = (e) => {
        const id = utils.findNodeId(e.target);
        const find = nodes.find(node => node.id === id);
        if (find) {
            // TODO
        }
    }

    const onNodeContextMenu: NodeMouseHandler = (e) => {
        const id = utils.findNodeId(e.target);
        const find = nodes.find(node => node.id === id);
        if (find) {
            showNodeContextMenu({
                event: e,
                props: find
            });
        }
        e.stopPropagation();
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
        e.stopPropagation();
    }

    useEffect(() => {
        onDagreLayout('TB');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onDagreLayout = (direction: string) => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getDagreLayoutedElements(
            nodes,
            edges,
            direction
        );

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
        reactFlowInstance.fitView();
    };

    return <div className="diagram-container" >
        {contextHolder}

        <DiagramToolBarComponent onClick={onContorlButtonClick} canUndo={undoSnapshot.length > 0} canRedo={redoSnapshot.length > 0} />

        <ReactFlow
            fitView
            attributionPosition="bottom-left"
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapToGrid={true}
            onNodeClick={onNodeClick}
            onContextMenu={(event) => {
                showDiagramContextMenu({ event });
                event.stopPropagation();
            }}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}>
            <Controls>
                <ColumnHeightOutlined className="gnomon-diagram-control-icons" style={{ width: '100%', height: '100%' }} onClick={() => onDagreLayout('TB')} />
            </Controls>
            <Background />
        </ReactFlow>
        <NodeContextMenu onItemClick={onNodeContextMenuItemClick} />
        <EdgeContextMenu onItemClick={onEdgeContextMenuClick} />
        <DiagramContextMenu onItemClick={onDiagramContextMenuClick} />
        {editNode && <NodeModalComponent
            node={editNode}
            isModalOpen={editNodeVisible}
            toggleVisible={() => setEditNodeVisible(!editNodeVisible)}
            handleOk={(event) => {
                makeUndoSnapshot();
                setNodes([...nodes.filter(node => node.id !== event.id), event])
            }} />}
    </div>
}