
import mongoose, { Document, Schema } from "mongoose";


export interface FlowLight {
    _id: string;
    name: string;
    alias: string;
    tag?: string;
    team: string;
}

export interface Flow extends Document {
    name: string;
    alias: string;
    teamId: string;

    doc?: string;
    tag?: string;

    nodes: GnomonNode[];
    edges: GnomonEdge[];
}

interface GnomonNode {
    id: string;
    data: NodeData;
    position: XYPosition;
    type: string;
}

interface NodeData {
    nodeType: string,
    label: string,
    description?: string,
}

interface XYPosition {
    x: number;
    y: number;
}

interface GnomonEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    type: string;
}

const flowSchema = new Schema({
    name: { type: String, required: true },
    alias: { type: String, required: true, unique: true, lowercase: true },
    teamId: { type: Schema.Types.ObjectId },
    doc: { type: String },
    tag: { type: String },
    nodes: [{
        id: { type: String, required: true },
        data: {},
        position: {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        }
    }],
    edges: [{
        id: { type: String, required: true },
        source: { type: String, required: true },
        target: { type: String, required: true },
        label: { type: String },
    }],
    extensions: [{
        component: { type: String, required: true },
        props: { },
    }]
}, { timestamps: true });



export default mongoose.model<Flow>('flows', flowSchema);