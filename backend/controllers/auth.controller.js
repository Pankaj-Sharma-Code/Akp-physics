import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const signup = async (req, res) => {
    try {
        const { username, domain, mobile, email, password, gender } = req.body;
        const imageFile = req.files?.image;

        if (!username || !domain || !mobile || !email || !password || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const existingMobile = await User.findOne({ mobile });
        if (existingMobile) {
            return res.status(400).json({ error: "Mobile number already exists" });
        }

        if (typeof mobile !== 'string' || mobile.length !== 10) {
            return res.status(400).json({ error: "Invalid Mobile Number" });
        }

        if (imageFile && !imageFile.mimetype.startsWith("image/")) {
            return res.status(400).json({ error: "Uploaded file is not an image" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let image = '';
        if (imageFile) {
            const imageBase64 = `data:${imageFile.mimetype};base64,${imageFile.data.toString("base64")}`;
            const uploadResult = await cloudinary.uploader.upload(imageBase64, {
                folder: "user_profiles",
                transformation: [
                    { width: 1000, crop: "scale" },
                    { quality: "auto" },
                    { fetch_format: "auto" }
                ]
            });
            image = uploadResult.secure_url;
        }
        if(image==='')
        image = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

        const newUser = new User({
            username,
            mobile,
            email,
            password: hashedPassword,
            gender,
            image,
            domain,
        });

        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            mobile: newUser.mobile,
            email: newUser.email,
            gender: newUser.gender,
            image: newUser.image,
            domain: newUser.domain,
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            email: user.email,
            gender: user.gender,
            image: user.image,
            domain: user.domain,
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}