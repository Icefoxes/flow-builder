import { ElkNode } from "elkjs";
import ELK from 'elkjs/lib/elk.bundled.js';
import {
    Node,
    Edge,
} from 'reactflow';
import { NodeConfig } from "./node";

const elk = new ELK()

type Direction = 'LR' | 'UD';

const transformGraph = (nodes: Node<any>[], edges: Edge[], direction: Direction = 'LR') => {
    return {
        id: "root",
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': 'UP',
            'org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers': `${NodeConfig.NodeSpace}`
        },
        children: [
            ...nodes.map(node => {
                return {
                    id: node.id,
                    width: NodeConfig.Width,
                    height: NodeConfig.Height,
                }
            })
        ],
        edges: [...edges.map(edge => {
            return {
                id: edge.id,
                sources: [edge.source],
                targets: [edge.target]
            }
        })]
    }
}

export const ELKLayout = (nodes: Node<any>[], edges: Edge[], direction: Direction = 'LR') => {
    const graph = transformGraph(nodes, edges, direction);
    return elk.layout(graph)
        .then(calc => {
            const positionedNodes = calc.children;
            if (positionedNodes) {
                return nodes.map(node => {
                    const found = positionedNodes.find(x => x.id === node.id) as ElkNode;
                    return Object.assign({}, node, {
                        position: {
                            x: found.x,
                            y: found.y
                        },
                    } as Node<any>)
                });
            } else {
                return [];
            }
        })
}
