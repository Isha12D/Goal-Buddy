import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Login = ({ toggleLoginForm, toggleSignupForm }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  const {login, error, loading} = useAuth();

  useEffect(()=>{
    setEmail('');
    setPassword('');
    setErrorMessage('');
  },[]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // axios.post('http://localhost:3001/login', {email, password})
  //   // .then(result => {
  //   //     console.log(result);
  //   //     if(result.data === 'Success'){
  //   //       navigate('/display')
  //   //     }
  //   //     else{
  //   //       alert(result.data);
  //   //     }
  //   // })
  //   // .catch(err => console.log(err))
  //   axios.post('http://localhost:3001/login', {email, password})
  //   .then(result => {
  //     if(result.data.accessToken && result.data.refreshToken) {
  //         localStorage.setItem('accessToken', result.data.accessToken);
  //         localStorage.setItem('refreshToken', result.data.refreshToken);
  //         navigate('/display');
  //     } else {
  //         alert(result.data);
  //     }
  //   })
  //   .catch(err => console.log(err));
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      const result = await axios.post('http://localhost:3006/auth/login', { email, password });
      
      if (result.data.accessToken && result.data.refreshToken) {
        // Directly access user details from the response
        const user = {
          _id: result.data.user._id,   // Get user ID from the response
          name: result.data.user.name, // Get user's name from the response
          email: result.data.user.email, // Get email from the response
          profilePic: result.data.user.profilePic,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        };
  
        // Use the login function from context to update user state
        login(user); 
        //console.log(user); // Log the user object
        //console.log(user._id); // Log only the user ID
  
        // Save tokens to localStorage (optional, for persistence)
         localStorage.setItem('accessToken', result.data.accessToken);
         localStorage.setItem('refreshToken', result.data.refreshToken);
        
        // Redirect to the display page
        navigate('/main');
      } else {
        setErrorMessage('Incorrect email or password');
        //alert(result.data);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMessage('Incorrect email or password');
    }
  };
  
  


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-orange-400 to-yellow-300 rounded-lg p-8 w-96 relative shadow-lg">
        <button
          onClick={toggleLoginForm}
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 bg-slate-400 opacity-30 rounded-full w-8 h-8 z-10 font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-zinc-900">Welcome Back!</h2>
        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name='email'
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>} {/* Display error if any */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '} 
            <span 
              onClick={toggleSignupForm}
              className="text-blue-500 cursor-pointer">Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
