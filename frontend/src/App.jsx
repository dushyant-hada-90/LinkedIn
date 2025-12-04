import React, { useContext } from 'react'
import { Navigate, Route ,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { userDataContext } from './context/UserContext'

export const App = () => {
  let {userData} = useContext(userDataContext)
  const isnotEmpty = Object.keys(userData).length> 0;
  console.log(userData,isnotEmpty,"---");
  
  
  return (
    <Routes>
      <Route path='/' element={isnotEmpty?<Home/>:<Navigate to ="/login"/>}/>
      <Route path='/signup' element={isnotEmpty? <Navigate to ="/"/> : <Signup/> }/>
      <Route path='/login' element={isnotEmpty? <Navigate to ="/"/> : <Login/>}/>
    </Routes>
  )
}

export default App