import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./userModel";

export interface IClass extends Document {
    name: string, 
    teacher: IUser['_id'],
    students: IUser['_id'][],
}


const ClassSchema: Schema = new Schema({
    name: {
        type: String, 
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    students: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    }
});

export default mongoose.model<IClass>('Class', ClassSchema)