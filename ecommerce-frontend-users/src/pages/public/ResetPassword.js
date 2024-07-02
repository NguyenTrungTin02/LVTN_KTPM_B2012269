import React, { useState } from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'
const ResetPassword = () => {


  const [password, setPassword]=useState('')
 const {token} = useParams();
 

  const handleResetPassword = async ()=>{
    const response = await apiResetPassword({password,token})
    if(response?.success){
        toast.info(response.message,{theme:"colored"})
        

      }else toast.info(response.message)

  }
  return (
    <div className='absolute top-0 left-0 bottom-0 right-0 bg-white flex justify-center z-50'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='email'>Nhập mật khẩu mới</label>
          <input type='text' id='password' placeholder=''
          value={password}
          onChange={e=>{setPassword(e.target.value)}}
          className='w-[800px] p-2 border-b outline-none'/>
        </div>
        <div className='mt-8 ml-5'>
          <Button
            name='Gửi'
            handleOnclick={handleResetPassword}
            children="Gửi"
          />


        </div>
    </div>
  )
}

export default ResetPassword