import mongoose, { Document } from "mongoose";

export interface Team extends Document {
    name: string;
    description: string;
}

const teamschema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<Team>('teams', teamschema);