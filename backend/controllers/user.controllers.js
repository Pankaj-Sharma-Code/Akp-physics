import User from "../models/user.model.js"
import { v2 as cloudinary } from "cloudinary"
import bcrypt from "bcryptjs"

export const updateImage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const imageFile = req.files?.image;

        if (imageFile && !imageFile.mimetype.startsWith("image/")) {
            return res.status(400).json({ error: "Uploaded file is not an image" });
        }

        if (user.image) {
            const publicId = user.image.split("/").slice(-2).join("/").split(".")[0]; 
            const deleteResponse = await cloudinary.uploader.destroy(publicId);
        }

        let newImageUrl = user.image;
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
            newImageUrl = uploadResult.secure_url; 
        }

        user.image = newImageUrl;
        await user.save();

        res.status(200).json({
            message: "Profile image updated successfully",
            image: newImageUrl,
        });

    } catch (error) {
        console.log("Error in update image: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const updateDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const { username, domain, mobile, email } = req.body;
        
        if (mobile && mobile !== user.mobile) {
            const existingUserByMobile = await User.findOne({ mobile });
            if (existingUserByMobile) {
                return res.status(409).json({ message: "Mobile number already exists." });
            }
        }
        
        if (email && email !== user.email) {
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                return res.status(409).json({ message: "Email already exists." });
            }
        }


        user.username = username || user.username; 
        user.domain = domain || user.domain;
        user.mobile = mobile || user.mobile;
        user.email = email || user.email;

        await user.save();

        return res.status(200).json({ message: "User details updated successfully." });
    } catch (error) {
        console.error("Error updating user details:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const user = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" }); 
    }
};


export const changePassword = async (req,res)=>{
    const { currentPassword ,newPassword } = req.body;
    const userId = req.user.id;
    try {
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide all fields." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
}

export const getDetail = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user details", error: error.message });
    }
};
