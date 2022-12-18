export interface NodeTypeMeta {
    name: string;
    icon: number;
    attributes: AttributeInfo[];
}

export enum AttributeType {
    Input = 'Input',
    Selection = 'Selection',
    CheckBox = 'CheckBox',
    TextArea = 'TextArea',
    List = 'List'
}

export interface AttributeInfo {
    // for check box
    default?: boolean | string;
    // for selections
    selections?: string[];
    // for object
    children?: AttributeInfo[];

    // common
    type: AttributeType;
    name: string;
    property?: string;
    required: boolean;
}