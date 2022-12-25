export interface NodeTypeMetaInfo {
    name: string;
    icon: number;
    functionalType: FunctionalTypeEnum
    attributes: AttributeInfo[];
}

export interface NodeTypeMeta extends NodeTypeMetaInfo {
    _id: string;
}

export enum AttributeType {
    Input = 'Input',
    Selection = 'Selection',
    CheckBox = 'CheckBox',
    TextArea = 'TextArea',
    ListObject = 'ListObject'
}

export enum FunctionalTypeEnum {
    Storage = "Storage",
    Processor = "Processor",
    External = "External",
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