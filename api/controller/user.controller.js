import bcryptjs from "bcryptjs"
import User from "../models/usermodel.js"
import { errorHandler } from "../utils/error.js"
export const test = (req, res) => {
    res.json({ message: "api is Working" })
}

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
export const updateUserInfo = async (req, res, next) => {
    const userId = req.body.id;
    let userPassword = req.body.password
    if (!userId) {
        return next(errorHandler(400, "User ID is required in the request body."));
    }
    if (!userPassword || userPassword === '') {
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, "User not found."));
        }
        userPassword = user.password;
    } else {
        if (userPassword.length < 6) {
            return next(errorHandler(400, "password must be at least 6 characters"));
        }
        userPassword = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username.length < 4 || req.body.username.length > 12) {
        return next(errorHandler(400, "username must be between 4 and 12 characters "));
    }
    if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "username canot contain sapces"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, "username can only contain letters and numbers"));
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                email: req.body.email,
                username: req.body.username,
                password: userPassword,
            }
        }, {
            new: true
        })
        if (!updatedUser) {
            return next(errorHandler(404, "user not found"))
        }
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        return next(error)
    }
}