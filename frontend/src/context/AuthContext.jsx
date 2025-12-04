import React, { createContext } from 'react'

const serverUrl = "http://localhost:8000"

export const authDataContext = createContext()
let value = {
    serverUrl,
}

function AuthContext({children}) {
  return (
    <div>
        <authDataContext.Provider value={value}>
        {children}
        </authDataContext.Provider>
    </div>
  )
}

export default AuthContext