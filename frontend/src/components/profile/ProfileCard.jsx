import { IoCallOutline } from "react-icons/io5";
import { MdOutlineMail, MdDomain, MdOutlineEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const ProfileCard = () => {
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageUpdated, setImageUpdated] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [userId, setUserId] = useState("user-id-placeholder");

    const [tempName, setTempName] = useState("");
    const [tempDepartment, setTempDepartment] = useState("");
    const [tempMobile, setTempMobile] = useState("");
    const [tempEmail, setTempEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/user`);
                const { username, domain, mobile, email, image } = response.data;
                setName(username);
                setDepartment(domain);
                setMobile(mobile);
                setEmail(email);
                setImage(image);

                setTempName(username);
                setTempDepartment(domain);
                setTempMobile(mobile);
                setTempEmail(email);
            } catch (error) {
                toast.error("Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, [userId]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = { username: tempName, domain: tempDepartment, mobile: tempMobile, email: tempEmail };

            await axios.post("/api/user/update/details", updatedData);
            toast.success("Profile updated successfully!");

            setName(tempName);
            setDepartment(tempDepartment);
            setMobile(tempMobile);
            setEmail(tempEmail);

            const modal = document.getElementById('my_modal_3');
            modal.close();
        } catch (error) {
            toast.error(error.response.data.message || "Failed to update profile.");
            const modal = document.getElementById('my_modal_3');
            modal.close();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setImageFile(file);
            setImageUpdated(true);
        }
    };

    const handleUpdateImage = async () => {
        if (!imageFile) return;

        setIsUpdating(true);
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const response = await axios.put("/api/user/update/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setImage(response.data.image);
            toast.success("Image updated successfully!");
            setImageUpdated(false);
        } catch (error) {
            toast.error("Failed to update image.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            await axios.post("/api/user/update/password", {
                currentPassword,
                newPassword
            });
            toast.success("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            const passwordModal = document.getElementById('password_modal');
            passwordModal.close();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password.");
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center p-10 gap-10">
            <div className="relative group flex-shrink-0">
                <img
                    src={image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    alt="Profile"
                    className="rounded-full w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-cover"
                />
                <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 rounded-full cursor-pointer transition-opacity"
                >
                    <MdOutlineEdit className="text-white text-2xl" />
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </div>

            <div className="flex flex-col justify-center text-center sm:text-left">
                <div className="flex items-center gap-2 sm:gap-5 text-xl sm:text-3xl">
                    <h1 className="font-semibold">{name}</h1>
                    <button onClick={() => document.getElementById('my_modal_3').showModal()}>
                        <MdOutlineEdit className="text-gray-500 cursor-pointer" />
                    </button>
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                <h3 className="font-bold text-lg mb-2">Edit Profile</h3>

                                <div className="mb-2">
                                    <label className="label text-xs">Name</label>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="label text-xs">Department</label>
                                    <select
                                        value={tempDepartment}
                                        onChange={(e) => setTempDepartment(e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="" disabled>
                                            Domain
                                        </option>
                                        <option>NEET</option>
                                        <option>JEE</option>
                                        <option>CLASS 11</option>
                                        <option>CLASS 12</option>
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label className="label text-xs">Mobile</label>
                                    <input
                                        type="tel"
                                        value={tempMobile}
                                        onChange={(e) => setTempMobile(e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="label text-xs">Email</label>
                                    <input
                                        type="email"
                                        value={tempEmail}
                                        onChange={(e) => setTempEmail(e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-full mt-4" onClick={handleFormSubmit}>Update</button>
                            </form>
                        </div>
                    </dialog>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm md:text-lg text-gray-600">
                    <MdDomain className="text-gray-500" />
                    <h2>{department}</h2>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm md:text-lg text-gray-600">
                    <IoCallOutline className="text-gray-500" />
                    <p>{mobile}</p>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm md:text-lg text-gray-600">
                    <MdOutlineMail className="text-gray-500" />
                    <p>{email}</p>
                </div>

                {/* Add button to trigger password change modal */}
                <button
                    onClick={() => document.getElementById('password_modal').showModal()}
                    className="btn btn-secondary mt-4"
                >
                    Change Password
                </button>
            </div>

            {imageUpdated && !isUpdating && (
                <button onClick={handleUpdateImage} className="btn btn-primary mt-4">Update Image</button>
            )}

            {/* Password Change Modal */}
            <dialog id="password_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <h3 className="font-bold text-lg mb-3">Change Password</h3>
                        <input
                            type="password"
                            className="input input-bordered w-full mb-3"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            className="input input-bordered w-full mb-3"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            className="input input-bordered w-full mb-4"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            onClick={handlePasswordChange}
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ProfileCard;
