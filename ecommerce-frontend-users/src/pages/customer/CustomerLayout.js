import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../utils/path'
import { useSelector } from 'react-redux'
import { SidebarCustomer } from '../../components'

const CustomerLayout = () => {

  const {isLoggedIn, current} = useSelector(state=>state.user)
  if(!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} relative={true}/>
  return (
    <div className='flex'>
      <SidebarCustomer/>
      <div className='flex-auto bg-gray-100 min-h-screen'>
      <Outlet/>
      </div>
      </div>
  )
}

export default CustomerLayout