export interface Extension {
    component: string;
    props: object;
}

export interface FlowLight {
    _id: string;
    name: string;
    alias: string;
    tag?: string;
    teamId: string;
}

export interface FlowInfo {
    name: string;
    alias: string;
    tag?: string;
    teamId: string;
    doc?: string;
    nodes: GnomonNode[];
    edges: GnomonEdge[];

    extensions: Extension[];
}

export interface Flow extends FlowInfo {
    _id: string;

    createdAt: string;
    updatedAt: string;
    __v: number;
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



export interface SearchItem {
    flowId: string;
    flowName: string;
    nodeName: string;
    nodeType: string;
    alias: string;
}