import { useEffect } from "react";
import Display from "./Pages/Display.jsx"
import Home from './Pages/Home.jsx'
import Login from './Components/Login.jsx'
import Main from './Pages/Main.jsx'
import Profile from "./Pages/Profile.jsx";
import { refreshAccessToken } from "./services/authServices";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import YourGoals from "./Components/YourGoals.jsx";
import EditProfile from "./Pages/EditProfile.jsx";


function App() {
  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem('refreshToken')) {  // Check for refreshToken
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Error refreshing access token:', error);
          // Redirect to login if token refresh fails
          window.location.href = '/login';
        }
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="display" element={<Display/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="your-profile" element={<Profile/>}/>
        <Route path="your-goals" element={<YourGoals/>}/>
        <Route path="edit-profile" element={<EditProfile/>}/>
      </Routes>
    </Router>
  )
}

export default App
