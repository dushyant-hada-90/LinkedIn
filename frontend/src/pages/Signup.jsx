import logo from '../assets/logo.svg'
import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import axios from "axios"
import { ClipLoader } from "react-spinners";
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'

function Signup() {

  let [show, setShow] = useState(false)
  let navigate = useNavigate()
  let { userData, setUserData } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)
  let [firstName, setFirstName] = useState("")
  let [lastName, setLastName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [fieldErrors, setFieldErrors] = useState({})
  let [status, setStatus] = useState(false);


  const handleSignup = async (e) => {
    e.preventDefault()
    setStatus("loading")
    // console.log(firstName,lastName,email,password,);

    try {
      let result = await axios.post(serverUrl + "/api/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      }, { withCredentials: true })
      console.log(result, "try");
      setUserData(result.data.user)
      navigate('/')
      toast.success("Signed up successfully")
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")

    } catch (error) {
      console.log(error, "catch");
      const status = error.response?.status;
      const data = error.response?.data || {};

      switch (data.error) {
        case "VALIDATION_ERROR":
          setFieldErrors(data.fields);
          toast.error("please fill all fields");
          break;

        case "EMAIL_ALREADY_EXISTS":
          setFieldErrors(data.fields);
          toast.error("Email already registered. Try logging in.");
          break;

        case "SHORT_PASSWORD":
          setFieldErrors(data.fields);
          toast.error("password must have at least 8 characters");
          break;

        default:
          toast.error("Something went wrong. Please Try again.");
      }
    }
    finally {
      setStatus(false);
    }
  }

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        let result = await axios.post(`${serverUrl}/api/auth/google`, { googleToken: tokenResponse.access_token }, { withCredentials: true },)
        setUserData(result.data.user)
        toast.success("Login successful");
        navigate('/')


      } catch (error) {
        console.log(error)
        toast.error("Google login failed");
      }
    },
    onError: () => {
      toast.error("Google login failed")
    }
  })
  return (
    <div className='w-full h-screen bg-white flex flex-col items-center justify-start gap-[10px]'>

      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt="" />
      </div>

      <form
        className='w-[90%] max-w-[400px] h-[600px] rounded-2xl shadw-md md:shadow-xl flex flex-col justify-center  gap-[10px] p-[15px] '
        onSubmit={handleSignup}>

        <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign up</h1>

        <input
          type="text"
          placeholder='firstname'
          value={firstName} 
          // required
          className={`w-[100%] h-[50px] border-2 ${fieldErrors.firstName ? "border-red-500" : "border-gray-600"} text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300`}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder='lastname'
          value={lastName}
          // required
          className={`w-[100%] h-[50px] border-2 ${fieldErrors.lastName ? "border-red-500" : "border-gray-600"} text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300`}
          onChange={(e) => setLastName(e.target.value)}
        />



        <input
          type="email"
          placeholder='email'
          value={email}
          // required
          className={`w-[100%] h-[50px] border-2 ${fieldErrors.email ? "border-red-500" : "border-gray-600"} text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300`}
          onChange={(e) => setEmail(e.target.value)}
        />


        <div className='w-[100%] h-[50px] border-none text-gray-800 text-[18px]  rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 relative'>
          <input
            type={show ? "text" : "password"}
            placeholder='password'
            value={password}
            required
            className={`w-[100%] h-[50px] border-2 ${fieldErrors.password ? "border-red-500" : "border-gray-600"} text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300`}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className='absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer'
            onClick={() => setShow(prev => !prev)}>
            {show ? "hide" : "show"}
          </span>
        </div>


        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full h-[50px] flex items-center justify-center gap-3 border border-gray-300 rounded-full bg-white text-gray-700 font-medium text-[16px] hover:bg-gray-50 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <button
          className='w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed' disabled={status == "loading"}>{status == "loading" ? <ClipLoader size={18} /> : "Sign up"}</button>

        <p className='text-center cursor-pointer' onClick={() => navigate("/login")}>Already have an account ? <span className='text-[#2a9bd8] '>Sign in</span> </p>

      </form>

    </div>
  )
}

export default Signup