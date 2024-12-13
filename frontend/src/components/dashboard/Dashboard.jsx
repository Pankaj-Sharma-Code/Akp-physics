import Footer from "../common/Footer";
import Item from "../common/Item";
import Navbar from "../common/Navbar";
import SlideBar from "../common/Slidebar";
import Sliding from "../common/Sliding";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const DashBoard = () => {
  useEffect(()=>{
    localStorage.clear();
  },[]);

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Navbar/>
        <Sliding/>
        <div className="flex flex-row align-middle justify-center flex-wrap gap-4 mt-10">
          <Link to="/dashboard/testlist"><Item imageSrc="https://i.ibb.co/vVQQY6S/exam.png" title="Tests"></Item></Link>
          <Link to="/dashboard/notes"><Item imageSrc="https://i.ibb.co/k4Qk8tM/notes.png" title="Notes"></Item></Link>
          <Link to="/dashboard/bank"><Item imageSrc="https://i.ibb.co/Y0td5k1/bank.png" title="Questionnaire"></Item></Link>
          <Link to="/dashboard/result"><Item imageSrc="https://i.ibb.co/m95fXHy/analysis.png" title="Result"></Item></Link>
          <Link to="/dashboard/contest"><Item imageSrc="https://i.ibb.co/7r6pnm9/trophy.png" title="Contest"></Item></Link>
          <Link to="/dashboard/neet"><Item imageSrc="https://i.ibb.co/0ngbXhq/medical-report.png" title="NEET"></Item></Link>
          <Link to="/dashboard/jee"><Item imageSrc="https://i.ibb.co/SQg4xWd/intelectual-property.png" title="JEE"></Item></Link>
          <Link to="/dashboard/contest/results"><Item imageSrc="https://i.ibb.co/6m3KzrQ/ranking.png" title="Ranking"></Item></Link>
          <Link to="/dashboard/feedback"><Item imageSrc="https://i.ibb.co/8gHR1rR/good-feedback.png" title="Feedback"></Item></Link>
        </div>
        <Footer/>
      </div>
      <SlideBar />
    </div>
  );
};

export default DashBoard;