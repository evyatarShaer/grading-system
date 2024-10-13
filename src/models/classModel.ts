import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IUser } from "./userModel";

export interface IClass extends Document {
    name: string, 
    teacher: ObjectId,
    students: ObjectId[],
}


const ClassSchema: Schema = new Schema({
    name: {
        type: String, 
        //required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        //required: true,
        ref: 'User'
    },
    students: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    }
});

export default mongoose.model<IClass>('Class', ClassSchema)