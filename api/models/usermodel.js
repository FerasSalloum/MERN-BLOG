import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://xukihcnndjysdmzmitoi.supabase.co/storage/v1/object/public/imageFile/profilePicture.png",
        required: true,
    }
}, { timestamps: true })
const User = mongoose.model("User", userSchema);
export default User;