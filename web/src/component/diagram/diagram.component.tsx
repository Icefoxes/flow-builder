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
    useKeyPress,
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
import { EdgeModalComponent } from "./edge";
import { EdgeContextMenu, EdgeContextMenuType, EDGE_MENU_ID } from "./edge/edge.context-menu";
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

// const edgeTypes = {
//     gnomon: UserDefinedEdge
// }

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

interface CurrentEditable {
    activeNode: GnomonNode | null,
    activeEdge: Edge | null,
    visible: boolean
}

const UNDO_CAPICITY = 3;

export const DiagramComponent: FC<{
    flow: Flow,
    updateFlow: (flow: Flow) => void,
}> = ({ flow, updateFlow }) => {
    // hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const reactFlowInstance = useReactFlow();
    const cmdAndSPressed = useKeyPress(['ControlLeft+s', 'Strg+s']);

    const { nodes: layoutedNodes, edges: layoutedEdges } = getDagreLayoutedElements(
        flow.nodes.map(n => Object.assign({}, n, { type: 'gnomon' })),
        flow.edges
    );

    // state
    const [undoSnapshot, setUndoSnapshot] = useState<EditState[]>([]);
    const [redoSnapshot, setRedoSnapshot] = useState<EditState[]>([]);
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);


    const [currentEditable, setCurrentEditable] = useState<CurrentEditable>({
        activeEdge: null,
        activeNode: null,
        visible: false
    });
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
        switch (control) {
            case ControlType.Save:
                setRedoSnapshot([]);
                setUndoSnapshot([]);
                updateFlow(updatedFlow);
                break;
            case ControlType.Edit:
                setRedoSnapshot([]);
                setUndoSnapshot([]);
                dispatch(setActiveFlow(updatedFlow));
                navigate('/');
                break;
            case ControlType.Undo: {
                const snap = undoSnapshot.pop();
                if (snap) {
                    makeRedoSnapshot();
                    setNodes(snap.nodes);
                    setEdges(snap.edges);
                }
                break;
            }
            case ControlType.Redo: {
                const snap = redoSnapshot.pop();
                if (snap) {
                    setNodes(snap.nodes);
                    setEdges(snap.edges);
                }
            }
        }
    }

    const onEdgeContextMenuClick = (control: EdgeContextMenuType, props: any) => {
        const selectedEdge = props as Edge;
        switch (control) {
            case EdgeContextMenuType.DeleteEdge:
                makeUndoSnapshot();
                setEdges([...edges.filter(edge => edge.id !== selectedEdge.id)]);
                break;
            case EdgeContextMenuType.EditEdge:
                setCurrentEditable({ activeNode: null, activeEdge: selectedEdge, visible: true });
                break;
        }
    }

    const onNodeContextMenuItemClick = (control: NodeContextMenuType, props: any) => {
        switch (control) {
            case NodeContextMenuType.CreateNode: {
                makeUndoSnapshot();
                const current = props as GnomonNode;
                setNodes([...nodes, Object.assign({}, newNode(nodes, Utils.newUUID()), {
                    position: {
                        x: current.position.x,
                        y: current.position.y + 100,
                    }
                })]);
                break;
            }
            case NodeContextMenuType.ChangeNodeType: {
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
                break;
            }

            case NodeContextMenuType.DeleteNode: {
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
                break;
            }
            case NodeContextMenuType.EditNode: {
                const node = props as GnomonNode;
                setCurrentEditable({ activeNode: node, activeEdge: null, visible: true });
                break;
            }
            case NodeContextMenuType.CopyNode: {
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
    }

    const onDiagramContextMenuClick = (item: DiagramContextMenuType) => {
        switch (item) {
            case DiagramContextMenuType.AddNode: {
                makeUndoSnapshot();
                setNodes([...nodes, newNode(nodes, Utils.newUUID())]);
                break;
            }
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

    useEffect(() => {
        if (cmdAndSPressed) {
            updateFlow(Utils.transformFlowLight(nodes, edges, flow));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cmdAndSPressed]);

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
        <DiagramToolBarComponent onClick={onContorlButtonClick} canUndo={undoSnapshot.length > 0} canRedo={redoSnapshot.length > 0} />

        <ReactFlow
            fitView
            attributionPosition="bottom-left"
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            // edgeTypes={edgeTypes}
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
        {currentEditable.activeNode && <NodeModalComponent
            node={currentEditable.activeNode}
            isModalOpen={currentEditable.visible}
            toggleVisible={() => setCurrentEditable({ activeNode: null, activeEdge: null, visible: false })}
            handleOk={(event) => {
                makeUndoSnapshot();
                setNodes([...nodes.filter(node => node.id !== event.id), event])
            }} />}
        {currentEditable.activeEdge && <EdgeModalComponent
            activeEdge={currentEditable.activeEdge}
            isModalOpen={currentEditable.visible}
            toggleVisible={() => setCurrentEditable({ activeNode: null, activeEdge: null, visible: false })}
            handleOk={(event) => {
                makeUndoSnapshot();
                setEdges([...edges.filter(e => e.id !== event.id), event])
            }} />}
    </div>
}