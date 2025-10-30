import User from "../models/usermodel.js"
import bcryptjs from "bcryptjs"

export const singnup = async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password || username == "" || email == "" || password == "") {
        return res.status(400).json({ message: "all fild are required" })
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
        res.json({ message: error.message })
    }
}