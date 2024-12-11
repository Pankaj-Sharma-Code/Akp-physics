import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import OneSignal from "react-onesignal";

import Login from "./components/auth/login/login";
import SignUp from "./components/auth/signup/SignUp";
import DashBoard from "./components/dashboard/Dashboard";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profle";
import TestList from "./components/tests/TestList";
import Notes from "./components/notes/Notes";
import Bank from "./components/bank/bank";
import Result from "./components/result/Result";
import ResultDashboard from "./components/result/resultDashboard/ResultDashboard";
import PracticeTest from "./components/tests/PracticeTest/PracticeTest";
import LoadingSpinner from "./components/common/loadingSpinner";
import InstructionPage from "./components/tests/Instructions";
import ResultAnalysis from "./components/result/resultDashboard/ResultAnalysis";
import Feedback from "./components/feedback/Feedback";
import Notification from "./components/notificatiion/Notification";
import Contest from "./components/contest/Contest";
import ContestInstruction from "./components/contest/ContestInstructions";
import ContestTest from "./components/contest/ContestTest";
import ContestResult from "./components/contest/ContestResult";
import ContestRank from "./components/contest/ContestRank";
import ContestAnalysis from "./components/contestAnalysis/ContestAnalysis";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(()=>{
    OneSignal.init({
      appId: "cc3065ea-c981-4d8b-8e8e-e8dc6152cedb",
      safari_web_id: "web.onesignal.auto.185a3882-a3fa-4e4c-9216-d752294e35fc",
      notifyButton: {
        enable: false,
      },
    });
  },[]);


  const authUser = async () => {
    try {
      const res = await axios.post(
        "/api/auth/getMe", 
        {}, 
        {
          withCredentials: true,
        }
      );

      const data = await res.data;
      setIsAuthenticated(!data.error); 
    } catch (error) {
      console.error("Authentication error:", error);
      setIsAuthenticated(false); 
    }
  };

  useEffect(() => {
    authUser();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" replace />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashBoard />} />} />
        <Route path="/dashboard/:profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/dashboard/testlist" element={<ProtectedRoute element={<TestList />} />} />
        <Route path="/dashboard/notes" element={<ProtectedRoute element={<Notes />} />} />
        <Route path="/dashboard/bank" element={<ProtectedRoute element={<Bank />} />} />
        <Route path="/dashboard/result" element={<ProtectedRoute element={<Result />} />} />
        <Route path="/dashboard/result/result-dashboard/:testId" element={<ProtectedRoute element={<ResultDashboard />} />} />
        <Route path="/dashboard/testlist/:test_id/attempt" element={<ProtectedRoute element={<PracticeTest />} />} />
        <Route path="/dashboard/testlist/:test_id/instructions" element={<ProtectedRoute element={<InstructionPage/>}/>} />
        <Route path="/dashboard/result/result-dashboard/:test_id/analysis" element={<ProtectedRoute element={<ResultAnalysis/>}/>} />
        <Route path="/dashboard/notification" element={<ProtectedRoute element={<Notification/>}/>}/>
        <Route path="/dashboard/feedback" element={<ProtectedRoute element={<Feedback/>}/>}/>
        <Route path="/dashboard/contest" element={<ProtectedRoute element={<Contest/>}/>}/>
        <Route path="/dashboard/contest/:contestId/instructions" element={<ProtectedRoute element={<ContestInstruction/>}/>}/>
        <Route path="/dashboard/contest/:contestId/attempt" element={<ProtectedRoute element={<ContestTest/>}/>}/>
        <Route path="/dashboard/contest/results" element={<ProtectedRoute element={<ContestResult/>}/>}/>
        <Route path="/dashboard/contest/results/:contestId" element={<ProtectedRoute element={<ContestRank/>}/>}/>
        <Route path="/dashboard/contest/results/questions/:contestId" element={<ProtectedRoute element={<ContestAnalysis/>}/>}/>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;