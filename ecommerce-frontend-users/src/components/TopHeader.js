import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from '../utils/path'
import { getCurrent } from '../app/user/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import { CiLogout } from "react-icons/ci";
import { clearMessage, logout } from '../app/user/userSlice'
import Swal from 'sweetalert2'


const TopHeader = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {isLoggedIn,current,mes} = useSelector(state=>state.user)



  useEffect(()=>{
    const setTimeOut =  setTimeout (()=>{
      if(isLoggedIn) dispatch(getCurrent())
    },200)

    return ()=>{
      clearTimeout(setTimeOut)
    }

  },[dispatch,isLoggedIn])


  useEffect(()=>{
    if(mes) Swal.fire('Thất bại',mes,'info').then(()=>{
        dispatch(clearMessage())
        navigate(`/${path.LOGIN}`)
    })
  },[mes])

  return (
    <div className='h-[38px] w-full bg-gray-500 flex items-center justify-center'>
        <div className='w-main flex items-center justify-between text-xs text-white'>
            <span>ĐẶT HÀNG TRỰC TUYẾN HOẶC GỌI CHO CHÚNG TÔI (+1800) 000 8808</span>
            {isLoggedIn && current
            ? <div className='flex gap-4 text-sm items-center'>
                <span>{`Xin chào, ${current?.name}`}</span>

            </div>
            : <Link to={`/${path.LOGIN}`}>Đăng nhập và Đăng ký</Link>}
        </div>
    </div>
  )
}

export default TopHeader