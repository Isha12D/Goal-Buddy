import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../Context/AuthContext'

const Signup = ({toggleSignupForm}) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const {signup} = useAuth();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);   //regex expression-> /\S+@\S+\.\S+/
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      setErrorMessage('');

      if (!validateEmail(email)) {
        setErrorMessage('Invalid email format');
        return;
      }

      axios.post('http://localhost:3006/auth/signup',{name, email, password})
      .then(result => {console.log(result);
        signup(result.data);
        navigate('/main')
      })
      .catch(err => setErrorMessage('Signup failed. Try again.'))
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-orange-400 to-yellow-300 rounded-lg p-8 w-96 relative shadow-lg">
        <button
          onClick={toggleSignupForm}
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 bg-slate-400 opacity-30 rounded-full w-8 h-8 z-10 font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Sign Up</h2>
        <form className="space-y-4 " onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name='email' //isse hi emails ki recommendations aai :>
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name='password'
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>
        
      </div>
    </div>
  )
}

export default Signup;
