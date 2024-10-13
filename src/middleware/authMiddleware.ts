import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//לפני שאממש בפועל אני מגדיר אינטרפייס שיכלול משתמש

interface AuthRequest extends Request {
    user?: { userId: string, userRole?: string }
};


//אימות משתמש
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // ניסיון לחלץ את הטוקן 
    const token = req.cookies.token
    //אם אין תוקן תחזיר שגיאה 401
    if (!token) {
        res.status(401).json({ message: 'אין לך טוקן התנתק וזריזז' });
        return;
    }
    try {
        //ניסיון לאמת את הטוקן
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, userRole: string }
        //אם האימות מצליח אני מוסיף את פרטי המשתמש לאובייקט הבקשה
        req.user = decoded;
        //ממשיך לפונקציה הבאה בשרשרת הטיפול
        next();
    } catch (error) {
        res.status(401).json({ message: 'הטוקן לא בתוקף' });
    }
}

export const managerAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.userRole !=='manager') {
        res.status(403).json({message: "Access denied, Managers only!"})
    } else {
        next()
    }
}

