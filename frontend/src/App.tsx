
import './App.css';
import { useForm } from 'react-hook-form';
import {useEffect,useState} from 'react';
import InfoTable  from './pages/InfoTable';
import React from 'react';
import NavBar from './Navbar';
import Home from './pages/Home';
import Handover from './pages/Handover';
import { Route,Routes,Navigate ,useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UpdatePatientInfo from './pages/UpdatePatientInfo';
import CheckList from './pages/CheckList';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfile from './pages/PatientProfile';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
      // Check if the user is logged in based on the presence of a token or flag in localStorage
      localStorage.getItem('isLoggedIn') === 'true'
    );
    const [userName, setUserName] = useState<String>("");
    const location = useLocation();


    // Update isLoggedIn state when the user logs in or out
    useEffect(() => {
      if (location.pathname === '/login') {
        // If the user is on the login page, make sure the state matches
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      }
    }, [location]); 

    // Handle the window unload event to set isLoggedIn to false
    useEffect(() => {
      const handleUnload = (e : BeforeUnloadEvent) => {
        // Set isLoggedIn to false in localStorage when the window is closed
        localStorage.setItem('isLoggedIn', 'false');
      };

      // Attach the event listener
      window.addEventListener('unload', handleUnload);

      // Remove the event listener when the component is unmounted
      return () => {
        window.removeEventListener('unload', handleUnload);
      };
    }, []);


    return (
      <div className="h-screen flex flex-col">
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName} />
        <div className="bg-primary flex-grow">
          <div className="flex justify-center">
            <div className="bg-secondary w-full lg:w-5/6 mt-5 rounded-md">
              <Routes>
                <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                <Route path="/InfoTable" element={isLoggedIn ? <InfoTable /> : <Navigate to="/login" />} />
                <Route path="/Handover" element={isLoggedIn ? <Handover /> : <Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}  userName={userName} setUserName={setUserName}/>} />
                <Route path="/UpdatePatientInfo" element={isLoggedIn ? <UpdatePatientInfo /> : <Navigate to="/login" />} />
                <Route path="/CheckList" element={isLoggedIn ? <CheckList username={userName} /> : <Navigate to="/login" />} />
                <Route path="/PatientDashBoard" element={isLoggedIn ? <PatientDashboard /> : <Navigate to="/login" />} />
                <Route path="/PatientProfile" element={isLoggedIn ? <PatientProfile userName={userName} /> : <Navigate to="/login" />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
export default App;
