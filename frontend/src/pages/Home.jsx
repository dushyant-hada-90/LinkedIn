import React, { useContext, useState } from 'react'
import Nav from '../components/Nav'
import noProfile from "../assets/noProfile.svg"
import { FaPlus } from "react-icons/fa";
import { MdOutlineCameraAlt } from "react-icons/md";
import { userDataContext } from '../context/UserContext';
import { HiPencil } from "react-icons/hi2";
import EditProfile from '../components/EditProfile';

function Home() {
  let { userData, setUserData, edit, setEdit } = useContext(userDataContext)
  return (
    <div className='w-full min-h-[100vh]  bg-[#f0efe7] pt-[100px] flex justify-center gap-[20px] items-start px-[20px] flex-col md:flex-row'>
      {edit && <EditProfile />}
      <Nav />


      <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative'>

        <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center  relative cursor-pointer' onClick={() => setEdit(true)}>
          <img src={null} alt="" className='w-full' />
          <MdOutlineCameraAlt className='absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white' />
        </div>

        <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] cursor-pointer ' onClick={() => setEdit(true)}>
          <img src={noProfile} alt="dp" className='h-full' />
        </div>
        <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex justify-center items-center  cursor-pointer' onClick={() => setEdit(true)}>
          <FaPlus className='text-white' />
        </div>
        <div className='text-[19px] font-semibold text-gray-700 mt-[30px] pl-[20px]'>
          <div >{`${userData.firstName} ${userData.lastName}`}</div>
          <div >{`${userData.headline || "smple headline"}`}</div>
          <div className='text-[16px] text-gray-500'>{userData.location}</div>
        </div>

        <button className='w-[100%] h-[40px] rounded-full border-2 my-[20px] border-[#2dc0ff] text-[#2dc0ff] cursor-pointer transition duration-200 hover:bg-[#2dc0ff] hover:text-white hover:shadow-md flex justify-center items-center gap-[10px]' onClick={() => setEdit(true)}>View Profile <HiPencil />
        </button>

      </div>

      <div className='w-full lg:w-[50%] min-h-[200px] bg-[white] shadow-lg'>

      </div>

      <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg'>

      </div>

    </div>
  )
}

export default Home