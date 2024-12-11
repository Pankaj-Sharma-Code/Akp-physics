import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post("/api/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, 
      });

      toast.success("Login Successful");
      setTimeout(() => {
        navigate("/dashboard");
        window.location.reload();
      }, 500);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage); 
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left hidden md:block">
          <p className="py-6">
            <img
              src="https://static.uacdn.net/production/_next/static/images/home-illustration.svg?q=75&auto=format%2Ccompress&w=640"
              alt="Login"
              className="max-w-full h-auto"
            />
          </p>
        </div>
        
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <h3 className="text-center mt-4 font-bold text-xl mb-4">Login</h3>
          <form className="card-body pt-0" onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-control mb-4">
              <div className="mb-1 p-1">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-300"> SignUp</Link>
              </div>
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;