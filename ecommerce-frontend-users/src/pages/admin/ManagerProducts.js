import React, { useCallback, useEffect, useState } from 'react'
import {DescriptionProduct, InputFrom, Pagination, Varriants} from '../../components'
import { useForm } from 'react-hook-form'
import { apiDeleteProduct, apiGetProduct } from '../../apis'
import { formatMoney } from '../../utils/helpers'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import UpdateProduct from './UpdateProduct'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdDashboardCustomize } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";


const ManagerProducts = () => {

  const navigate = useNavigate();
  const location = useLocation()

  const [params] = useSearchParams()

  const {register,formState:{errors},handleSubmit,reset,watch} = useForm()
  const [products, setProducts] = useState(null)
  const [count, setCount] = useState(0)

  const [editProduct, setEditProduct] = useState()

  const [varriant,setVarriant] = useState(null)


  const [update, setUpdate] = useState(false)


 


  const [isShowDescription, setIsShowDescription] = useState(false);

  const [isDescription, setIsDescription] = useState(null);

  

  const render = useCallback(()=>{
    setUpdate(!update)
  },[update])

  useEffect(()=>{
    render()
},[isShowDescription])


  const fetchProducts = async(params)=>{
      const response = await apiGetProduct({...params,limit:process.env.REACT_APP_LIMIT})
      if(response.success) {
        setProducts(response.products)
        setCount(response.counts)
      }
  }
  
  const queryDecounce= useDebounce(watch('q'),800)

  useEffect(()=>{
    if(queryDecounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({q: queryDecounce}).toString()
      })
      
    }
    else{
      navigate({
        pathname: location.pathname,
      })
    }
  },[queryDecounce])

  useEffect(()=>{
      const searchParams = Object.fromEntries([...params])
      
      fetchProducts(searchParams)
  },[params,update])

  const handleSearchProducts= (data)=>{

  }


  const handleDeleteProduct=(id)=>{

    
    Swal.fire({
        title:"Chắc chắn xóa?",
        text:"Có chắc chắn xóa",
        icon: 'warning',
        
        showCancelButton: true,
        cancelButtonText:"Hủy",
        confirmButtonText:'Xóa'
    }).then(async(rs)=>{
      if(rs.isConfirmed){
        console.log(id)
        const response = await apiDeleteProduct(id)
        if(response.success){
          toast.success(response.mes)
        }
        else{
          toast.error(response.mes)
        }
        render()
      }
    })
  }






  return (
    <div className='w-full flex flex-col gap-4 relative pr-4'>

      {isShowDescription && (
           <div className='absolute inset-0 min-h-screen z-50 bg-white'>
          <div >

            <DescriptionProduct isDescription={isDescription}  
          
                
                  setIsShowDescription={setIsShowDescription}
                  
                  />
          </div>
        </div>
      )}





     { editProduct &&
       <div className='absolute inset-0 min-h-screen z-50 bg-white'>
       <UpdateProduct editProduct={editProduct} render={render} setEditProduct={setEditProduct}/>
     </div>
     }
      { varriant &&
       <div className='absolute inset-0 min-h-screen z-50 bg-white'>
       <Varriants varriant={varriant} render={render} setVarriant={setVarriant}/>
     </div>
     }

      <div className='px-4 border-b w-full items-center justify-between pt-4'>
        <h1 className='text-3xl font-bold tracking-tight'>Quản lý sản phẩm</h1>
      </div>
      <div className='flex w-full justify-end items-center px-8'>
        <form className='w-[50%]' onSubmit={handleSubmit(handleSearchProducts)}>
          <InputFrom
            id='q'
            register={register}
            errors={errors}
            fullWith
            placeholder='Tìm kiếm sản phẩm.....'
          
          />
        </form>
      </div>
      <table className='table-auto'>
          <thead>
            <tr className='bg-sky-700 text-white border-white'>
              <th className='text-center'>STT</th>
              <th className='text-center'>Hình ảnh</th>
              <th className='text-center'>Tên sản phẩm</th>
              <th className='text-center'>Nhà sản xuất</th>
              <th className='text-center'>Loại sản phẩm</th>  
              <th className='text-center'>Xếp hạng</th>
              <th className='text-center'>Số phiên bản</th>
              <th className='text-center'>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((el,index)=>(
              <tr key={el._id}>
                <td className='text-center'>{((+params.get('page')-1 >1 ? +params.get('page')-1:0)*process.env.REACT_APP_LIMIT)+1+index}</td>
                <td className='text-center'>
                  <img src={el.thumb} alt='thumb' className='w-12 h-12 object-cover'/>
                </td>
                <td className='text-center'>{el.title}</td>
                <td className='text-center'>{el.brand}</td>
                <td className='text-center'>{el.category}</td>
                <td className='text-center'>{el.totalRating}</td>
                <td className='text-center'>{el?.varriants?.length + 1}</td>
                <td className='text-center'>
                    
                    <span onClick={()=>handleDeleteProduct(el._id)}
                       className='hover:underline cursor-pointer px-1 inline-block' title='Xóa sản phẩm'><RiDeleteBin6Line /></span>
                    <span onClick={()=>setVarriant(el)}
                       className='hover:underline cursor-pointer px-1 inline-block' title='Thêm biến thể sản phẩm'><MdDashboardCustomize /></span>

                    <span onClick={()=>{
                      setIsShowDescription(!isShowDescription)

                      setIsDescription(el)
                      
                    }}
                      className='hover:underline cursor-pointer px-1 inline-block' title='Xem chi tiết sản phẩm'><CgDetailsMore /></span>
                </td>
              </tr>
            ))}
          </tbody>
      </table>
      

      <div className='w-full flex justify-end my-8'>
        <Pagination totalCount={count} />
      </div>
    </div>
  )
}

export default ManagerProducts