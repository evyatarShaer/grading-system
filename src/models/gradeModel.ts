import mongoose, { Schema, Document } from "mongoose";

export interface IGrade extends Document {
    grade: number, 
    commit: string
}


const GradeSchema: Schema = new Schema({
    grade: {
        type: String, 
        required: true
    },
    commit: {
        type: String,
        required: true
    }
});

export default mongoose.model<IGrade>('Department', GradeSchema)