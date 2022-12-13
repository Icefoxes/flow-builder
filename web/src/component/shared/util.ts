import { Edge, Node } from "reactflow";
import { Flow, GnomonEdge, GnomonNode, NodeData } from "../../model";
import { v4 as uuidv4 } from 'uuid';

const round = (num: number) => Math.round(num * 100) / 100

const transformFlowLight = (nodes: Node[], edges: Edge[], flow: Flow) => {
    const nodesLight = nodes.map(node => {
        return {
            id: node.id,
            data: node.data as NodeData,
            position: {
                x: round(node.position.x),
                y: round(node.position.y),
            },
            type: node.type
        } as GnomonNode
    });
    const edgesLight = edges.map(edge => {
        return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label,
            type: edge.type
        } as GnomonEdge
    });
    return Object.assign({}, flow, {
        nodes: nodesLight,
        edges: edgesLight
    }) as Flow
}

const newUUID = () => {
    return uuidv4().replaceAll('-', '');
}

const findEdgeId = (event: EventTarget) => {
    let element = event as HTMLElement;
    if (element) {
        while (element !== null && element.parentElement !== null && !element.parentElement.getAttribute('aria-label') && element.parentElement.tagName !== 'g') {
            element = element.parentElement;
        }
        const parent = element.parentElement;
        if(parent) {
            return parent.getAttribute('data-testid')?.substring('rf__edge-'.length);
        }
    }
    return null;
}

const utils = {
    transformFlowLight,
    newUUID,
    findEdgeId
}

export default utils;