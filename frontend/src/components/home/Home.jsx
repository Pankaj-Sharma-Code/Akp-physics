import Hero from "./Hero";
import Sliding from "../common/Sliding";
import Footer from "../common/Footer";
import Card from "../common/Card";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <div className="drawer">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <div className="navbar bg-base-300 w-full">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-6 w-6 stroke-current">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </label>
                        </div>
                        <div className="mx-2 flex-1 px-2 font-semibold text-transparent text-[1.2rem] bg-gradient-to-tr from-[#7d7bb9] to-[#ae445f] bg-clip-text no-underline text-base md:text-lg">AKP Physics</div>
                        <div className="hidden flex-none lg:block">
                            <ul className="menu menu-horizontal">
                                <li className="text-[1.1rem] no-underline hover:text-transparent hover:bg-gradient-to-tr hover:from-[#9796f0] hover:to-[#fbc7d4] hover:bg-clip-text"><a>Home</a></li>
                                <li className="text-[1.1rem] no-underline hover:text-transparent hover:bg-gradient-to-tr hover:from-[#9796f0] hover:to-[#fbc7d4] hover:bg-clip-text"><a>Courses</a></li>
                                <li className="text-[1.1rem] no-underline hover:text-transparent hover:bg-gradient-to-tr hover:from-[#9796f0] hover:to-[#fbc7d4] hover:bg-clip-text"><a>About Us</a></li>
                                <li className="text-[1.1rem] no-underline hover:text-transparent hover:bg-gradient-to-tr hover:from-[#9796f0] hover:to-[#fbc7d4] hover:bg-clip-text"><a>Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                    {/* Page content here */}
                    <Sliding></Sliding>
                    <div className="flex flex-row align-middle justify-center flex-wrap gap-4 mt-10">
                    <Hero></Hero>
                    </div>


                    <div className="flex flex-row align-middle justify-center flex-wrap gap-4 mt-10">
                        <Link to="/signup"><Card imageSrc="https://i.ibb.co/3mX8jx2/engineers.png" title="IIT JEE"/></Link>
                        <Link to="/signup"><Card imageSrc="https://i.ibb.co/Smbt7Y5/medical-team.png" title="NEET"/></Link>
                        <Link to="/signup"><Card imageSrc="https://i.ibb.co/hZWLTZB/bank-1.png" title="Bank"/></Link>
                        <Link to="/signup"><Card imageSrc="https://i.ibb.co/Y840BQg/school.png" title="Class 12"/></Link>
                        <Link to="/signup"><Card imageSrc="https://i.ibb.co/4PZWwGP/university.png" title="Foundation"/></Link>
                        <Link to="/signup"><Card imageSrc="https://i.ibb.co/CsSwvWX/graduate.png" title="IIT-JAM"/></Link>
                    </div>
                    <Footer></Footer>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 min-h-full w-80 p-4">
                        <li><a>Home</a></li>
                        <li><a>Courses</a></li>
                        <li><a>About Us</a></li>
                        <li><a>Contact Us</a></li>
                    </ul>
                </div>
            </div>
            
        </>
    );
};


export default Home;