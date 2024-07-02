import React, { useCallback, useEffect, useState } from 'react'
import { apiDeleteUser, apiGetAllUser,apiUpdateUser } from '../../apis/user'
import moment from 'moment'
import { Button, InputFiled, InputFrom, Pagination, Select } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { block, role } from '../../utils/contants'
import clsx from 'clsx'


const ManagerUser = () => {

  const {handleSubmit,register,formState:{errors}} = useForm({ 
    email:'',
    name:'',
    mobile:'',
    role:'',
    isBlock:''
  })

  const [queries, setQueries] = useState({
    q:""
  })


  const [edit, setEdit] = useState(null)

  const [users, setUsers] = useState(null)
  const fetchAllUser = async(params)=>{
    const response = await apiGetAllUser({...params, limit: process.env.REACT_APP_LIMIT })
    if(response.success) setUsers(response)
  }


  const queriesDebounce = useDebounce(queries.q,800)

  const [params] = useSearchParams()

  const [update, setUpdate] = useState(null)

  const render = useCallback(()=>{
    setUpdate(!update)
  },[update])

  useEffect(()=>{
    const queries= Object.fromEntries([...params])
    if(queriesDebounce) queries.q=queriesDebounce
    fetchAllUser(queries)
  },[queriesDebounce,params,update])


  const handleUpdate = async(data)=>{

    const response = await apiUpdateUser(data,edit._id)
    if(response.success) {
      setEdit(null)
      render()
      toast.success(response.mes)
    }else{
      toast.error(response.mes)
    }

  }


  const handleDelete =async (id) =>{
     Swal.fire({
      title:'Có chắc chắn xóa',
      text: "Có chắc chắn xóa",
      showCancelButton: true
     }).then(async(result)=>{
        if(result.isConfirmed){
          const response = await apiDeleteUser(id)
          if(response.success){
           render()
           toast.success(response.mes)
          }
          toast.error(response.mes)
        }
     })
    
  }
 
  return (
    <div className={clsx('w-full', edit && 'pl-12')}>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Quản lý người dùng</span>
        
      </h1>
      <div className='w-full p-4'>
        <div className='flex justify-end py-4'>
            <InputFiled
              nameKey={'q'}
              value={queries.q}
              setValue={setQueries}
              style='w500'
              placeholder='Tìm kiếm theo tên hoặc email....'
            
            />
        </div>
           <form  onSubmit={handleSubmit(handleUpdate)}>

            {edit && <Button type='submit'>Cập nhật</Button>}

            <table className='table-auto mb-6 text-left w-full'>
            <thead className='font-bold  text-[13px] border  bg-gray-600 text-white justify-between'>
              <tr className='border border-gray-500'>
              <th className='px-4 py-2'>#</th>
              <th className='px-4 py-2'>Email</th>
              <th className='px-4 py-2'>Họ và tên</th>
              <th className='px-4 py-2'>Vai trò</th>
              <th className='px-4 py-2'>Điện thoại</th>
              <th className='px-4 py-2'>Trạng thái</th>
              <th className='px-4 py-2'>Ngày tạo</th>
              <th className='px-4 py-2'>Thao tác</th>
              </tr>

            </thead>
            <tbody>
              
                {users?.users?.map((el,index)=>(
                 <tr key={el._id} className='border border-gray-500'>
                   <td className='px-4 py-2'>{((+params.get('page') || 1) - 1) * process.env.REACT_APP_LIMIT + index + 1}</td>
                    <td className='px-4 py-2'>{
                        edit?._id === el._id ? 
                        <InputFrom
                          register={register}
                          errors={errors}
                          id={'email'}
                          validate={
                                  {require:true,
                                  pattern: {
                                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                      message: "invalid email address"
                                    }
                                  }}
                          defaultValue={edit?.email}
                          fullWith
                        /> : <span>{el.email}</span>
                    }</td>
                    <td className='px-4 py-2'>{
                        edit?._id === el._id ? 
                        <InputFrom
                        register={register}
                        errors={errors}
                        id={'name'}
                        validate={{require:"aaa"}}
                        defaultValue={edit?.name}
                        fullWith
                        /> : <span>{el.name}</span>
                    }</td>
                    <td className='px-4 py-2'>{
                        edit?._id === el._id ? 
                        <Select
                          register={register}
                          fullWith
                          errors={errors}
                          defaultValue={el.role}
                          id={'role'}
                          validate={{require:'Require fill'}}
                          options={role}
                        /> : <span>{+el.role ===16?'Quản lý':'Người dùng'}</span>
                    }</td>
                    <td className='px-4 py-2'>{
                        edit?._id === el._id ? 
                        <InputFrom 
                          register={register}
                          errors={errors}
                          id={'mobile'}
                          validate={{require:true}}
                          defaultValue={edit?.mobile}
                          fullWith
                        /> : <span>{el.mobile}</span>
                    }</td>
                    <td className='px-4 py-2'>{
                        edit?._id === el._id ? 
                        <Select
                        register={register}
                        errors={errors}
                        id={'isBlock'}
                        validate={{require:true}}
                        defaultValue={edit?.isBlock}
                        fullWith
                        options={block}
                        /> : <span>{el.isBlock? 'Đã chặn':'Đang hoạt động'}</span>
                    }</td>
                    <td className='px-4 py-2'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                    <td className='px-4 py-2'> 
                     
                     {edit?._id === el._id ?  <span onClick={()=>setEdit(null)} className='px-2 text-yellow-600 hover:underline cursor-pointer'>Thoát</span>
                        :  <span onClick={()=>setEdit(el)} className='px-2 text-yellow-600 hover:underline cursor-pointer'>Sửa</span>}
                      <span 
                      onClick={()=>handleDelete(el._id)}
                      className='px-2 text-red-600 hover:underline cursor-pointer'>Xóa</span>
                    </td>
                  </tr>
                ))}
              
            </tbody>
          </table>
                 </form>

              <div className='w-full'>
                    <Pagination
                    totalCount={users?.counts}/>
            </div>
        </div>

        
    </div>
  )
}

export default ManagerUser