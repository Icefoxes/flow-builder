import dagre from "dagre";
import { Edge, Node, Position } from "reactflow";
import { NodeConfig } from "./node";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getDagreLayoutedElements = (nodes: Node<any>[], edges: Edge[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NodeConfig.Width, height: NodeConfig.Height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
  
        return Object.assign({}, node, {
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            position: {
                x: nodeWithPosition.x - NodeConfig.Width / 2,
                y: nodeWithPosition.y - NodeConfig.Height / 2
            }
        });
    });

    return { nodes, edges };
}