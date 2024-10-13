import User, { IUser } from "../models/userModel";
import Class, { IClass } from "../models/classModel";
import { ObjectId } from 'mongoose';


export const createUser = async (userData: Partial<IUser>, classId: string, className?: Partial<IClass>): Promise<string> => {
    if (userData.role === 'teacher')
    {
        const teacher = new User({
            ...userData,
            className: className
        });
        await teacher.save()

        const NewClass = new Class({
            name: className,
            teacher: teacher.id
        }); 
            
        await NewClass.save();
        return NewClass.id;
    }

    const theClass: IClass | null = await Class.findById(classId);
    if (!theClass) {
        throw new Error("Class not found");
    }

    const student: IUser = new User({
        ...userData,
        class: classId,
        className: null
    });
    await student.save()
     
    theClass.students.push(student._id  as unknown as ObjectId)
    await theClass.save()
    return classId;
};




export const getUserById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id).select("-password").populate("department")
};

export const getAllUsers = async (): Promise<IUser[]> => {
    return await User.find().select("-password").populate("department")
}

export const updateUser = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password")
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(id)
}
