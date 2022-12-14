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
    StoreProcedure = 'StoreProcedure',
    Flink = "Flink",
    Redhat = 'Redhat',

    SQLServer = "SQLServer",
    Kafka = "Kafka",
    ElasticSearch = "ElasticSearch",
    HBase = "HBase",
    KDB = "KDB",
    CloudKDB = "CloudKDB",
    Redis = "Redis",
    S3 = "S3",

    ISGCloud = 'ISGCloud',
    Rio = 'Rio',
    Olympus = 'Olympus',
    PxNET = 'PxNET',
    Ion = 'Ion',
    DataHighway = 'DataHighway'
}

export interface NodeData {
    nodeType: NodeType,
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

