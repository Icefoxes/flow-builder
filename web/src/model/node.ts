export interface Extension {
    component: string;
    props: object;
}

export interface Flow {
    id: string;
    name: string;
    alias: string;
    team: string;
    doc?: string;
    tag?: string;

    nodes: GnomonNode[];
    edges: GnomonEdge[];
    
    extension: Extension[];
}

export interface XYPosition {
    x: number;
    y: number;
}

export interface NodeData {
    nodeType: string,
    label: string,
    description?: string,
    owner?: string;
    redirect?: string;
    reposiotry?: string;
}


export interface GnomonNode {
    // meta
    id: string;
    parent?: string;
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

export interface FlowLight {
    id: string;
    name: string;
    tag?: string;
    team: string;
}

export interface SearchItem {
    flowId: string;
    flowName: string;
    nodeName: string;
    nodeType: string;
}