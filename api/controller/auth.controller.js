import User from "../models/usermodel.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"

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