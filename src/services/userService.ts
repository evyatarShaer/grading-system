import User, { IUser } from "../models/userModel";


export const createUser = async (userData: Partial<IUser>, departmentId: string): Promise<IUser> => {
    const user = new User({
        ...userData,
        department: departmentId
    });

    return await user.save()
};

// לקבל משתמש לפי ID
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

// לקבל משתמשים לפי התפקיד שלהם
export const getUserByRole = async (role: "employee" | "manager"): Promise<IUser[]> => {
    return await User.find({ role }).select("-password");
};

// קבלת משתמשים לפי טווח שכר
export const getUSerBySalaryRange = async (minSalary: number, maxSalary: number): Promise<IUser[]> => {
    return await User.find({
        salary: { $gte: minSalary, $lte: maxSalary }
    }).select("-password")
}

export const getUserStatistics = async () => {
    // מציאת המשתמש עם השכר הגבוה ביותר
    const highestSalary = await User.findOne().sort("-salary").select("username salary");

    // הגדרת זמנים לבדיקת איחורים
    const now = new Date();

    const startOfTheDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), // נותן את היום
        0,
        0,
        0
    )
    const nineAM = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), // נותן את היום
        9,
        0,
        0
    )

    const lateEmployee = await User.find({
        role: "employee",
        lastLogin: { $gte: startOfTheDay, $gt: nineAM }
    }).select("username lastLogin")

    // חישוב ממוצע שכר
    const avarageSalary = await User.aggregate([
        { $group: { avgSalary: { $avg: "$salary" } } }
    ])

    return {
        highestSalary,
        lateEmployee,
        avarageSalary
    }
}