import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {Button, InputFrom, Loading} from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import avatar from '../../assets/avatar.jpg'
import { apiUpdateAUser } from '../../apis'
import { getCurrent } from '../../app/user/asyncActions'
import { toast } from 'react-toastify'

const Personal = () => {
  
  const {register, formState:{errors,isDirty}, handleSubmit, reset} = useForm()

  const {current} = useSelector(state=>state.user)

  const dispatch = useDispatch()

  const [loading, setLoading]= useState(false)


  useEffect(()=>{
    reset({
      name: current?.name,
      email: current?.email,
      mobile: current?.mobile,
      avatar: current?.avatar,
      address: current?.address
    })
  },[current])

  const handleUpdate= async(data)=>{
        setLoading(true)
        const fromData = new FormData()
        if(data.avatar.length >0 ) fromData.append('avatar',data.avatar[0])
        delete data.avatar
        for(let i of Object.entries(data)) fromData.append(i[0],i[1])
        const response = await apiUpdateAUser(fromData)
        setLoading(false)
        if(response.success) {
          dispatch(getCurrent())
          toast.success(response.mes)
        }else toast.error(register.mes)


  }

  return (
    <div className='w-full  p-4'>
      <header className='text-2xl font-semibold border-b '>
        Thông tin cá nhân
      </header>

      {loading && <Loading/>}

      <form onSubmit={handleSubmit(handleUpdate)} 
      className='w-3/5 mx-auto py-8 flex flex-col gap-4' >
        
        
        <InputFrom 
          label="Họ và tên:"
          register={register}
          errors={errors}
          id='name'
          validate={{require: "Không bỏ trống"}}
        
        />

        <InputFrom 
        
        label="Email:"
        register={register}
        errors={errors}
        id='email'
        validate={{require: "Không bỏ trống"}}
        disabled={true}
      />


      <InputFrom 
        
        label="Điện thoại:"
        register={register}
        errors={errors}
        id='mobile'
        validate={{require: "Không bỏ trống"}}
      
      />

<InputFrom 
        
        label="Địa chỉ:"
        register={register}
        errors={errors}
        id='address'
        validate={{require: "Không bỏ trống"}}
      
      />


      {/* <div className='flex items-center gap-2'>
        <span className='font-medium'>Vai trò:</span>
        <span>{+current?.role === 16 ? 'Quản lý':'Người dùng'}</span>
      </div> */}


      {/* <div className='flex items-center gap-2'>
        <span className='font-medium'>Ngày tạo tài khoản:</span>
        <span>{moment(current?.createAt).format("DD/MM/YYYY")}</span>
      </div> */}

      <div className='flex items-center gap-2'>
        <span className='font-medium'>Ảnh đại diện:</span>
       <label htmlFor='file'> <img src={current?.avatar || avatar} alt='avatar' className='w-10 h-10 object-cover rounded-full'/></label>
      <input type='file' id='file' hidden {...register('avatar')} />
      </div>

      {isDirty &&  <div className='w-full justify-end flex'>
       <Button type='submit'>Cập nhật thông tin</Button>
       </div>}

      </form>
    </div>
  )
}

export default Personal