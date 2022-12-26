import mongoose, { Document, Schema } from "mongoose";

export interface NodeTypeMeta extends Document {
  name: string;
  icon: number;
  functionalType: FunctionalTypeEnum;
  attributes: AttributeInfo[];
}

enum FunctionalTypeEnum {
  Storage = "Storage",
  Processor = "Processor",
  External = "External",
}

interface AttributeInfo {
  // for check box
  default?: string;
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

enum AttributeType {
  Input = "Input",
  Selection = "Selection",
  CheckBox = "CheckBox",
  TextArea = "TextArea",
  List = "List",
}

const metaSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: Number, required: true },
    functionalType: {
      type: String,
      enums: Object.keys(FunctionalTypeEnum),
      required: true,
    },
    attributes: [
      {
        _id: false,
        type: {
          type: String,
          enums: Object.keys(AttributeType),
          required: true,
        },
        name: { type: String, required: true },
        property: { type: String },
        required: { type: Boolean, required: true },

        selections: { type: [] },
        default: { type: String },
        children: [
          {
            _id: false,
            type: { type: String, required: true },
            name: { type: String, required: true },
            property: { type: String },
            required: { type: Boolean, required: true },

            selections: { type: [] },
            default: { type: String },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<NodeTypeMeta>("metas", metaSchema);
