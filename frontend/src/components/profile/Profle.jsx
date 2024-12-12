import Card from "../common/Card";
import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import ProfileCard from "./ProfileCard";


const Profile = () => {
  return (
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <Navbar></Navbar>
          <ProfileCard />
        </div>
      </div>
      <div className="flex flex-row align-middle justify-center flex-wrap gap-4 mt-10">
        <div className='onesignal-customlink-container'></div>
        <Card imageSrc="https://i.ibb.co/3mX8jx2/engineers.png" title="IIT JEE"></Card>
        <Card imageSrc="https://i.ibb.co/Smbt7Y5/medical-team.png" title="NEET"></Card>
        <Card imageSrc="https://i.ibb.co/hZWLTZB/bank-1.png" title="Bank"></Card>
        <Card imageSrc="https://i.ibb.co/Y840BQg/school.png" title="Class 12"></Card>
        <Card imageSrc="https://i.ibb.co/4PZWwGP/university.png" title="Foundation"></Card>
        <Card imageSrc="https://i.ibb.co/CsSwvWX/graduate.png" title="IIT-JAM"></Card>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Profile;
