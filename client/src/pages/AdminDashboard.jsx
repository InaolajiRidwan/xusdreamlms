import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminDashBoard() {
  const {handleLogout} = useAuth()
  return (
    <div>
      <div>
      AdminDashBoard
      <button onClick={handleLogout} className="bg-red-400 text-white p-4">Logout</button>
    </div>
    </div>
  )
}
