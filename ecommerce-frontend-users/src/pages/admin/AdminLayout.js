import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import path from '../../utils/path'
import { SidebarAdmin } from '../../components'

const AdminLayout = () => {
  const {isLoggedIn, current} = useSelector(state=>state.user)
  if(!isLoggedIn || !current || +current.role !== 16) return <Navigate to={`/${path.LOGIN}`} replace={true}/>
  return (
    <div className='flex w-full   min-h-screen relative'>
      <div className='w-[220px] flex-none top-0 bottom-0 fixed  '>
        <SidebarAdmin/>
      </div>
      <div className='w-[230px]'></div>
      <div className='flex-auto'>
        <Outlet/>
      </div>
      </div>
  )
}

export default AdminLayout