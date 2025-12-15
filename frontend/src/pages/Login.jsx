import logo from '../assets/logo.svg'
import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import axios from "axios"
import { ClipLoader } from "react-spinners";
import Message from "../components/Message"
function Login() {

  let [show, setShow] = useState(false)
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData } = useContext(userDataContext)
  let [email, setEmail] = useState("dushyanthada90@gmail.com") //for dev only
  let [password, setPassword] = useState("12345678") //for dev only

  let [status, setStatus] = useState(false); // "error" | "success"


  const handleLogin = async (e) => {
    e.preventDefault()
    console.log(
      email,
      password,);

    try {
      setStatus("loading")
      let result = await axios.post(serverUrl + "/api/auth/login", {
        email,
        password,
      }, { withCredentials: true })
      console.log(result, "try");
      setUserData(result?.data?.user)
      setStatus(result.status)
      setEmail("")
      setPassword("")
      navigate('/')

    } catch (error) {
      console.log(error, "catch");
      setStatus(500)
    }
  }
  return (

    <div className='w-full h-screen bg-white flex flex-col items-center justify-start gap-[10px]'>

      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt="" />
      </div>

      <form
        className='w-[90%] max-w-[400px] min-h-[400px] rounded-2xl shadow-md md:shadow-xl flex flex-col justify-center  gap-[10px] p-[15px] '
        onSubmit={handleLogin}>

        <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Log in</h1>

        <input
          type="email"
          placeholder='email'
          value={email}
          required
          className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300'
          onChange={(e) => setEmail(e.target.value)}
        />


        <div className='w-[100%] h-[50px] border-none text-gray-800 text-[18px]  rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 relative'>
          <input
            type={show ? "text" : "password"}
            placeholder='password'
            value={password}
            required
            className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300'
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className='absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer'
            onClick={() => setShow(prev => !prev)}>
            {show ? "hide" : "show"}
          </span>
        </div>

        <Message status={status}
          // Optional: Custom messages for better context
          successMessage="Login successful"
          errorMessage="Oops! something went wrong" />

        <button
          className='w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[15px] text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed' disabled={status === "loading"}>{status === "loading" ? <ClipLoader size={18} /> : "Sign up"}</button>

        <p className='text-center cursor-pointer' onClick={() => navigate("/signup")}>Don't have an account ? <span className='text-[#2a9bd8] '>Sign up</span> </p>



      </form>

    </div>
  )
}

export default Login