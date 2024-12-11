import { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        mobile: "",
        domain: "",
        gender: "",
        image: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); 

        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("mobile", formData.mobile);
        data.append("domain", formData.domain);
        data.append("gender", formData.gender);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            const response = await axios.post("/api/auth/signup", data);
            toast.success("SignUp Successful");
            setTimeout(()=>{
                navigate('/dashboard');
                window.location.reload();

            },500);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-row">
                <div className="text-center lg:text-left hidden md:block">
                    <p className="py-6">
                        <img
                            src="https://static.uacdn.net/production/_next/static/images/home-illustration.svg?q=75&auto=format%2Ccompress&w=640"
                            alt="SignUp"
                        />
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <h3 className="text-center mt-4 font-bold text-xl mb-4">SignUp</h3>
                    <form className="card-body pt-0" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                name="username"
                                className="grow"
                                placeholder="Username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2 mt-4">
                            <input
                                type="email"
                                name="email"
                                className="grow"
                                placeholder="Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2 mt-4">
                            <input
                                type="password"
                                name="password"
                                className="grow"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2 mt-4">
                            <input
                                type="text"
                                name="mobile"
                                className="grow"
                                placeholder="Mobile Number"
                                required
                                value={formData.mobile}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="form-control w-full max-w-xs mt-4">
                            <select
                                name="domain"
                                className="select select-bordered"
                                required
                                value={formData.domain}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    Domain
                                </option>
                                <option>NEET</option>
                                <option>JEE</option>
                                <option>CLASS 11</option>
                                <option>CLASS 12</option>
                            </select>
                        </label>

                        <label className="form-control w-full max-w-xs mt-4">
                            <select
                                name="gender"
                                className="select select-bordered"
                                required
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    Gender
                                </option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </label>
                        <label className="gap-2 mt-4">
                            <input
                                type="file"
                                name="image"
                                className="file-input file-input-bordered w-full max-w-xs grow"
                                onChange={handleFileChange}
                            />
                        </label>

                        <div className="form-control mt-4">
                            <div className="mb-1 p-1">
                                Already have an account?
                                <Link to="/login" className="text-blue-300"> Login</Link>
                            </div>

                            {loading ? (
                                <button className="btn btn-primary" disabled>
                                    <span className="loading loading-spinner"></span> Signing Up...
                                </button>
                            ) : (
                                <button className="btn btn-primary" type="submit">
                                    SignUp
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
