import mongoose, { Schema, Document, ObjectId } from "mongoose";
import bcrypt from 'bcrypt';
import { isEmail } from 'validator';
import { IClass } from "./classModel";
import { IGrade } from "./gradeModel";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    role: string,
    grades: IGrade[],
    className?: string,
    lastLogin: Date
    class: ObjectId
    comparePassword(userPassword: string): Promise<boolean>
};

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: [ isEmail, 'invalid email' ],
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student'
    },
    grades: {
        type: [{ type: Schema.Types.ObjectId, ref: "grade" }],
        default: []
    },
    className: {
        type: String,
        unique: true,
        sparse: true
    },
    lastLogin: {
        type: Date
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: "class"
    }
},
 { timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
    return await bcrypt.compare(userPassword, this.password)
}

export default mongoose.model<IUser>("User", UserSchema)