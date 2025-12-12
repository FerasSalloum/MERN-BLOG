// utils/verifyUser.js

import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js'; 

export const verifyToken = (req, res, next) => {
    // التوكن مخزن في الكوكي باسم 'access_token'
    const token = req.cookies.access_token; 

    if (!token) {
        return next(errorHandler(401, 'Unauthorized: No token provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // خطأ 403: ممنوع (التوكن غير صالح أو منتهي الصلاحية)
            return next(errorHandler(403, 'Forbidden: Invalid token')); 
        }

        // إضافة بيانات المستخدم (المحتوية على ID) إلى الطلب
        req.user = user; 
        next(); // الاستمرار إلى الدالة التالية (المتحكم)
    });
};