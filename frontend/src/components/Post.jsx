import React from 'react'
import noProfile from "../assets/noProfile.svg";

function Post({id,author,like,comment,description,image}) {
    

  return (
    <div className='w-full min-h-[500px] bg-white rounded-lg shadow-lg'>
        <div>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer ' >
          <img src={author.profileImage || noProfile} alt="dp" className='h-full' />
        </div>
        </div>
    </div>
  )
}

export default Post