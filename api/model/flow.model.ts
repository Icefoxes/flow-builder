export interface Flow {
    id: string;
    name: string;
    team: string;
    
    doc?: string;
    tag?: string;

    nodes: GnomonNode[];
    edges: GnomonEdge[];
}

export interface XYPosition {
    x: number;
    y: number;
}

export enum NodeType {
    Kafka = "Kafka",
    Flink = "Flink"
}

export interface NodeData {
    nodeType: NodeType,
    label: string,
    description?: string,
}


export interface GnomonNode {
    id: string;
    data: NodeData;
    position: XYPosition;
    type: string;
}

export interface GnomonEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    type: string;
}
