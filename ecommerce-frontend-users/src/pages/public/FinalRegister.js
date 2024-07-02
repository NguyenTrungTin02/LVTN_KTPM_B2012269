import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import path from '../../utils/path'
import Swal from 'sweetalert2'

const FinalRegister = () => {
    const {status} = useParams()
    console.log(status)
    const navigate = useNavigate();
    useEffect(()=>{
        if(status==='failed') Swal.fire('Thất bại','Đăng ký thất bại','error').then(()=>{
            navigate(`/${path.LOGIN}`)
        })
        if(status==='success') Swal.fire('Thành công','Đăng ký thành công','success').then(()=>{
            navigate(`/${path.LOGIN}`)
        })
    },[status,navigate])
  return (
    <div className='h-screen w-screen bg-gray-100'></div>
  )
}

export default FinalRegister