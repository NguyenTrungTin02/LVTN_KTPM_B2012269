import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDebounce } from 'react-use'
import Swal from 'sweetalert2'
import { Button, CreateProCategory, EditProCategory, InputFiled, InputFrom, Pagination, Select } from '../../components'
import moment from 'moment'
import { apiDeleteCategory, apiGetCategories, apiUpdateCategory, apiUpdateUser } from '../../apis'


import { MdOutlineLibraryAdd } from "react-icons/md";
import { RxExit } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri"

const ManagerProCategory = () => {


    const {handleSubmit,register,formState:{errors}} = useForm({ 
        name:''
      })
    
      const [queries, setQueries] = useState({
        q:""
      })

      

      const [isShowAddCategory, setIsShowAddCategory] = useState(false);

      const [isShowEditCategory, setIsShowEditCategory] = useState(false);

      const [editCategory, setEditCategory] = useState(false);
    

    
      const [category, setCategory] = useState(null)


      const fetchAllCategory = async(params)=>{
        const response = await apiGetCategories( )
        if(response.success) setCategory(response)
      }
    
    
    //   const queriesDebounce = useDebounce(queries.q,800)
    
      const [params] = useSearchParams()
    
      const [update, setUpdate] = useState(null)
    
      const render = useCallback(()=>{
        setUpdate(!update)
      },[update])
    
      useEffect(()=>{
        const queries= Object.fromEntries([...params])
        // if(queriesDebounce) queries.q=queriesDebounce
        fetchAllCategory(queries)
      },[params,update])

      
      useEffect(()=>{
          render()
      },[isShowAddCategory])

    
    
     
    
    
      const handleDelete = async (id) => {
        Swal.fire({
          title: 'Có chắc chắn xóa',
          text: "Bạn có chắc chắn muốn xóa?",
          showCancelButton: true,
          cancelButtonText:"Hủy"
        }).then(async (result) => {
          if(result.isConfirmed) {
            const response = await apiDeleteCategory(id);
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


        {isShowAddCategory && (
            <div className='fixed inset-0 z-50 flex justify-center items-center'>
              <div className='bg-overplay w-full h-full'>

                <CreateProCategory
                    
                      setIsShowAddCategory={setIsShowAddCategory}
                      
                  />
          </div>
        </div>
      )}


      {isShowEditCategory && (
            <div className='fixed inset-0 z-50 flex justify-center items-center'>
              <div className='bg-overplay w-full h-full'>

                <EditProCategory
                    render={render}
                      setIsShowEditCategory={setIsShowEditCategory}
                      editCategory={editCategory}
                      
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
              <th className='px-4 py-2 text-center'>Tên loại sản phẩm</th>
              <th className='px-4 py-2 text-center'>Hình ảnh</th>
              {/* <th className='px-4 py-2 text-center'>Số lượng sản phẩm</th> */}
              <th className='px-4 py-2 text-center'>Ngày tạo</th>
              <th className='px-4 py-2 text-center'>Thao tác</th>
              </tr>

            </thead>
            <tbody>
              
                {category?.categories?.map((el,index)=>(
                 <tr key={el._id} className='border border-gray-500'>
                    <td className='px-4 py-2 text-center'>{index+1}</td>


                    <td className='px-4 py-2 text-center'>{
                       
                        <span>{el.name}</span>
                    }</td>

                    <td className='px-4 py-2 text-center'>
                    <img src={el?.thumb} alt='thumb' className='w-12 h-12'/>
                    </td>

                    
                    {/* <td className='px-4 py-2 text-center'>{
                        {el.}
                    }</td>
                  */}
                
               
                    <td className='px-4 py-2 text-center'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                    <td className='px-4 py-2 text-center'> 

                 
                      <span  
                        onClick={()=>{
                          setIsShowEditCategory(!isShowEditCategory)
                          setEditCategory(el)
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


          <div className=' flex flex-row items-center hover:underline cursor-pointer text-main' onClick={()=>setIsShowAddCategory(!isShowAddCategory)}>
            <span className='px-2'><MdOutlineLibraryAdd /></span>
          <div>Thêm loại sản phẩm</div>
          </div>


              <div className='w-full'>
                    <Pagination
                    totalCount={category?.categories?.length}/>
            </div>
       </div>
    </div>
  )
}

export default ManagerProCategory