import User from "../models/usermodel.js"
import bcryptjs, { truncates } from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const singnup = async (req, res, next) => {
    const { username, email, password } = req.body
    if (!username || !email || !password || username == "" || email == "" || password == "") {
        next(errorHandler(400, "all fields are required"))
    }
    const hashpassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashpassword,
    })
    try {
        await newUser.save();
        res.json("singnup is successful")
    } catch (error) {
        next(error)
    }
}
export const singnin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email == "" || password == "") {
        next(errorHandler(400, "all fields are required"))
    }
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(400, "User not found"))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"))
        }
        const token = jwt.sign(
            { id: validUser._id }, process.env.JWT_SECRET,
        )
        const { password: pass, ...rest } = validUser._doc;
        res.status(200).cookie("access_token", token, {
            httpOnly: true
        }).json(rest)
    } catch (error) {
        next(error);
    }
}

export const sync_user_data = async (req, res, next) => {
    const { name, email, profilePicture } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password, ...rest } = user._doc;
            res.status(200).cookie("access_token", token, {
                httpOnly: true,
                sameSite: 'lax',
                expires: new Date(Date.now() + 3600000 * 24 * 7) // صالح لمدة 7 أيام
            }).json(rest);
        } else {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashpassword = bcryptjs.hashSync(randomPassword, 10)
            const newUser = new User({
                username: name,
                // username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashpassword,
                profilePicture,
            })
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie("access_token", token, {
                httpOnly: true,
                sameSite: 'lax',
                expires: new Date(Date.now() + 3600000 * 24 * 7) // صالح لمدة 7 أيام
            }).json(rest);
        }
    } catch (error) {
        next(error)
    }
}

