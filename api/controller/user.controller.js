export const test = (req, res) => {
    res.json({ message: "api is Working" })
}
// controllers/user.controller.js

import { errorHandler } from '../utils/error.js';
import User from '../models/usermodel.js'; // تأكد من استيراد نموذج المستخدم

export const updateUserProfile = async (req, res, next) => {
    // 1. 🛡️ التحقق من ID: يتم الحصول على ID المستخدم من التوكن المُتحقق منه
    const userId = req.body.userId;
    if (!userId) {
        return next(errorHandler(400, "User ID is required in the request body."));
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                // نستخدم $set لتحديث الحقول المرسلة فقط
                $set: {
                    profilePicture: req.body.profilePicture, // حقل الصورة من الواجهة الأمامية
                    // يمكنك إضافة المزيد هنا: username: req.body.username
                },
            },
            { new: true } // new: true لترجع الوثيقة المحدثة
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        // 3. 📤 إرجاع البيانات الجديدة (بدون كلمة المرور)
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};