import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/loadingSpinner";
import OneSignal from "react-onesignal";

const Navbar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    OneSignal.init({
      appId: "18788e36-47d4-4830-a81a-e44c6d30f6c7",
    });
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); 

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logout Successfully");
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 500);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
    }
  };

  const authUser = async () => {
    try {
      const res = await axios.post(
        "/api/auth/getMe",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = res.data;

      if (data.error) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setUser(data);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsAuthenticated(false);
    }
  };
  const getUnreadNotificationCount = async () => {
    try {
      const res = await axios.get("/api/notification/count"); 
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  useEffect(() => {
    authUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      getUnreadNotificationCount(); 
    }
  }, [isAuthenticated, user]);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="navbar bg-base-300 w-full pt-0 pb-0 sm:pl-12 sm:pr-12">
      <div className="mx-2 flex-1 px-2 font-semibold text-transparent text-[1.2rem] bg-gradient-to-tr from-[#7d7bb9] to-[#ae445f] bg-clip-text no-underline text-base md:text-lg">
        <Link to="/">AKP Physics</Link>
      </div>
      <div className="flex-none">
        {isAuthenticated && user ? (
          <>
            <h2 className="hidden sm:block">{user.username}</h2>
            <ul className="menu menu-horizontal">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img alt="User avatar" src={`${user.image}`} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to={`/dashboard/${user.username}`} className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/dashboard/${user.username}`} className="justify-between">
                      Buy Notes
                    </Link>
                  </li>
                  <li><a onClick={logout}>Logout</a></li>
                  <li className="h-9"><div className='onesignal-customlink-container'></div></li>
                </ul>
              </div>
            </ul>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn btn-secondary ml-2" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </>
        )}
        <Link to="/dashboard/notification">
          <button className="ml-1 btn btn-ghost btn-circle" aria-label="Notifications">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && <span className="badge badge-xs badge-primary indicator-item">{unreadCount > 9 ? '9+': unreadCount}</span>}
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;