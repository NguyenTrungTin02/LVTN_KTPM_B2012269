import React, { useCallback, useEffect, useState } from 'react'
import { apiDeleteBrand, apiGetBrand } from '../../apis'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { CreateBrand, EditBrand, InputFiled, Pagination } from '../../components'
import moment from 'moment'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri"
import { MdOutlineLibraryAdd } from "react-icons/md";
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'


const ManagerBrand = () => {
  const [brand, setBrand] = useState(null)
  const [params] = useSearchParams()
  const [update, setUpdate] = useState(null)
  const [isShowAddBrand, setIsShowAddBrand] = useState(false);
  const [isShowEditBrand, setIsShowEditBrand] = useState(false);
  const [editBrand, setEditBrand] = useState(false);

  const {handleSubmit,register,formState:{errors}} = useForm({ 
    name:''
  })

  const [queries, setQueries] = useState({
    q:""
  })

  const fetchAllBrand = async(params)=>{
    const response = await apiGetBrand( )
    console.log(response)
    if(response.success) setBrand(response)
  }

  useEffect(()=>{
    const queries= Object.fromEntries([...params])
    // if(queriesDebounce) queries.q=queriesDebounce
    fetchAllBrand(queries)
  },[params,update])

  const render = useCallback(()=>{
    setUpdate(!update)
  },[update])

  useEffect(()=>{
    render()
},[isShowAddBrand])


const handleDelete = async (id) => {
  Swal.fire({
    title: 'Có chắc chắn xóa',
    text: "Bạn có chắc chắn muốn xóa?",
    showCancelButton: true,
    cancelButtonText:"Hủy"
  }).then(async (result) => {
    if(result.isConfirmed) {
      const response = await apiDeleteBrand(id);
      if(response.success) {
        render();
        toast.success(response.mes);
      } else {
        toast.error(response.mes);
      }
    }
  });
};






  return (
    <div className='w-full'>
        <div className='px-4 border-b w-full items-center justify-between pt-4'>
            <h1 className='text-3xl font-bold tracking-tight'>Quản lý loại sản phẩm</h1>
        </div>


        {isShowAddBrand&& (
            <div className='fixed inset-0 z-50 flex justify-center items-center'>
              <div className='bg-overplay w-full h-full'>

                <CreateBrand
                    
                      setIsShowAddBrand={setIsShowAddBrand}
                      
                  />
          </div>
        </div>
      )}


      {isShowEditBrand && (
            <div className='fixed inset-0 z-50 flex justify-center items-center'>
              <div className='bg-overplay w-full h-full'>

                <EditBrand
                    render={render}
                      setIsShowEditBrand={setIsShowEditBrand}
                      editBrand={editBrand}
                      
                  />
          </div>
        </div>
        )}


       <div className='w-full pl-4 pr-4'>
       <div className='flex justify-end py-4'>
            <InputFiled
              nameKey={'q'}
              value={queries.q}
              setValue={setQueries}
              style='w500'
              placeholder='Tìm kiếm loại sản phẩm'
            
            />
        </div>


        <form>

         

            <table className='table-auto mb-6 text-left w-full'>
            <thead className='font-bold  text-[13px] border  bg-gray-600 text-white justify-between'>
              <tr className='border border-gray-500'>
              <th className='px-4 py-2 text-center'>#</th>
              <th className='px-4 py-2 text-center'>Tên thương hiệu</th>
              <th className='px-4 py-2 text-center'>Logo thương hiệu</th>
            
              <th className='px-4 py-2 text-center'>Ngày tạo</th>
              <th className='px-4 py-2 text-center'>Thao tác</th>
              </tr>

            </thead>
            <tbody>
              
                {brand?.brand?.map((el,index)=>(
                 <tr key={el._id} className='border border-gray-500'>
                    <td className='px-4 py-2 text-center'>{index+1}</td>


                    <td className='px-4 py-2 text-center'>{
                       
                        <span>{el.name}</span>
                    }</td>

                    <td className='px-4 py-2 text-center'>
                      <img src={el?.thumb} alt='thumb' className='mx-auto w-12 h-12'/>
                    </td>

                    
                  
                 
                
               
                    <td className='px-4 py-2 text-center'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                    <td className='px-4 py-2 text-center'> 

                 
                      <span  
                        onClick={()=>{
                          setIsShowEditBrand(!isShowEditBrand)
                          setEditBrand(el)
                        }}
                      
                      className='px-2 hover:underline cursor-pointer inline-block' title='Chỉnh sửa'><FiEdit /></span>
                      <span 
                      onClick={()=>handleDelete(el._id)}
                      className='px-2  hover:underline cursor-pointer inline-block' title='Xóa'><RiDeleteBin6Line /></span>
                    </td>
                  </tr>
                ))}
              
            </tbody>
          </table>
        </form>


          <div className=' flex flex-row items-center hover:underline cursor-pointer text-main' 
          onClick={()=>setIsShowAddBrand(!isShowAddBrand)}
          >
            <span className='px-2'><MdOutlineLibraryAdd /></span>
          <div>Thêm thương hiệu</div>
          </div>


              <div className='w-full'>
                    <Pagination
                    totalCount={brand?.brand?.length}/>
            </div>
       </div>
    </div>
  )
}

export default ManagerBrand