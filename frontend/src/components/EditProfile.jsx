import React, { useContext, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../context/UserContext';
import noProfile from "../assets/noProfile.svg"
import { FaPlus } from 'react-icons/fa';
import { MdOutlineCameraAlt } from 'react-icons/md';

function EditProfile() {
    let { edit, setEdit, userData, setUserData } = useContext(userDataContext)
    let [firstName, setFirstName] = useState(userData.firstName || "")
    let [lastName, setLastName] = useState(userData.lastName || "")
    let [userName, setUserName] = useState(userData.userName || "")
    let [headline, setHeadline] = useState(userData.headline || "")
    let [location, setLocation] = useState(userData.location || "")
    let [gender, setGender] = useState(userData.gender || "")
    let [skills, setSkills] = useState(["skill1", "skill2"] || ["skill1", "skill2"])
    let [newSkills, setNewSkills] = useState("")

    function addSkill(e) {
        e.preventDefault()
        if (newSkills && !skills.includes(newSkills)) {
            setSkills([...skills, newSkills])
        }
        setNewSkills("")
    }

    function removeSkill(skill){
        if(skills.includes(skill)){
            setSkills(skills.filter((s)=>s!=skill))
        }
    }

    return (
        <div className='w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center'>
            <div className='w-full h-full bg-black opacity-[0.5] absolute'></div>

            <div className='w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] shadow-lg rounded-lg p-[10px] relative overflow-auto'>
                {/* cross */}
                <div className='absolute top-[20px] right-[20px] cursor-pointer' onClick={() => setEdit(false)}><RxCross1 className='w-[25x] h-[25px] text-gray-800 font-bold' /></div>
                {/* cover picture */}
                <div className='w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden'>
                    <img src="" alt="" />
                    <MdOutlineCameraAlt className='absolute right-[20px] top-[60px] w-[25px] h-[25px] text-[white] cursor-pointer' />

                </div>
                {/* profile picture */}
                <div className='w-[80px] h-[80px] rounded-full overflow-hidden cursor-pointer absolute top-[150px] ml-[20px]' onClick={() => setShowPopup(prev => !prev)}>
                    <img src={noProfile} alt="dp" />
                </div>
                <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[195px] left-[95px] rounded-full flex justify-center items-center  cursor-pointer'>
                    <FaPlus className='text-white' />
                </div>

                {/* form */}
                <div  className='w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]'>
                    <input type="text" placeholder='firstName' className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input type="text" placeholder='lastName' className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input type="text" placeholder='userName' className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <input type="text" placeholder='headline' className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                    <input type="text" placeholder='location' className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input type="text" placeholder='gender (male/female/other)' className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={gender} onChange={(e) => setGender(e.target.value)} />

                    <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                        <h1 className='text-[19px] font-semibold'>Skills</h1>
                        {skills &&
                            <div className='flex flex-col gap-[10px]'>
                                {skills.map((skill, index) => (
                                    <div key={index} className='w-full h-[40px] border-[1px] p-[10px] border-gray-600 bg-gray-200 rounded-lg flex justify-between items-center'>  
                                        <span>{skill}</span>
                                        <RxCross1 className='w-[20x] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={()=>{removeSkill(skill)}}/>
                                    </div>
                                ))}
                            </div>
                        }
                        <div  className='flex flex-col gap-[10px] items-start' >
                            <input type="text" placeholder='add new skills' value={newSkills} onChange={(e) => setNewSkills(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg' />
                            <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] cursor-pointer transition duration-200 hover:bg-[#2dc0ff] hover:text-white hover:shadow-md' onClick={addSkill}>Add</button>
                        </div>
                    </div>

                </div >
            </div>

        </div>
    )
}

export default EditProfile