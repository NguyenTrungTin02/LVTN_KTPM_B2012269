import React, { useCallback, useEffect, useState } from 'react'
import { apiGetOrderAdmin, apiGetOrders } from '../../apis'
import { useForm } from 'react-hook-form'
import { CustomSelect, DescriptionOrder, InputFrom, Pagination } from '../../components'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { statusOrder } from '../../utils/contants'
import { handler } from '@tailwindcss/line-clamp'
import withBaseComponent from '../../hocs/withBaseComponent'
import { formatMoney } from '../../utils/helpers'
import { CgDetailsMore } from "react-icons/cg";


const ManagerOrder = ({navigate,location}) => {

  const [order, setOrder] = useState(null)

  const [params] = useSearchParams()

  const [count, setCount] = useState(0)


  const [isShowDescriptionOrder, setIsShowDescriptionOrder] = useState(false)

  const [isDescriptionOrder, setIsDescriptionOrder] = useState(null)

  const {register,formState:{errors},watch,setValue} = useForm()
  const q=watch('q')
  const status=watch('status')

  const fetchOrder = async(params)=>{
    const response = await apiGetOrderAdmin({
      ...params,
      limit:process.env.REACT_APP_LIMIT,
      sort:'-createdAt'

    })
   if(response.success) {
    setOrder(response?.orders)
    setCount(response?.counts)
   }

    
}


    useEffect(()=>{
      const pr=Object.fromEntries([...params])
      fetchOrder(pr)
    },[params])

    

    const handlerSearchStatus = (paramObject) => {
      if (paramObject && paramObject.value) {
        navigate({
          pathname: location.pathname,
          search: createSearchParams({ status: paramObject.value }).toString()
        });
      }else{
        navigate({
          pathname: location.pathname,
          search: createSearchParams({}).toString()
          
        });
        
      }
    };

    const [update, setUpdate] = useState(false)

    const render = useCallback(()=>{
      setUpdate(!update)
      fetchOrder()
    },[update])
  
    useEffect(()=>{
      render()
  },[isShowDescriptionOrder])
    

  return (
    <div className='w-full px-4'>
      <header className='text-3xl font-semibold py-4 border-b'>
          Quản lý danh sách đơn hàng
      </header>



      {isShowDescriptionOrder && (
            <div className='fixed inset-0 z-50 flex justify-center items-center'>
              <div className='bg-overplay w-full h-full'>

                <DescriptionOrder

                isDescriptionOrder={isDescriptionOrder}
                    
                      setIsShowDescriptionOrder={setIsShowDescriptionOrder}
                      
            />
    </div>
  </div>
)}


      <div className='flex justify-end px-4 mt-2 mb-2'>
      <form className='flex items-center gap-4 ' >
          {/* <InputFrom
            id='q'
            register={register}
            errors={errors}
            fullWith
            placeholder='Tìm đơn hàng...'
          
          /> */}

        <CustomSelect
        
          options={statusOrder}
          value={status}
          onChange={(value)=>handlerSearchStatus(value)}
          className='col-span-1'
        />

        </form>

      </div>

      <table className='table-auto w-full'>
          <thead className='font-bold  border'>
            <tr className='bg-sky-700 text-white border-white'>
              <th className='text-center px-4 py-2'>#</th>
              <th className='text-center px-4 py-2'>Tên khách hàng</th>
              <th className='text-center px-4 py-2'>Tổng tiền</th>
              <th className='text-center px-4 py-2'>Trạng thái</th>
              <th className='text-center px-4 py-2'>Ngày mua</th>
              <th className='text-center'>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((el,index)=>(
              <tr key={el._id} className='border border-gray-500'>
               <td className='px-4 py-2 text-center'>{((+params.get('page') || 1) - 1) * process.env.REACT_APP_LIMIT + index + 1}</td>
                <td className='text-center px-4 py-2' >
                    
                      {el?.orderBy?.name}
                   

                </td>
                <td className='text-center px-4 py-2'>{formatMoney(el?.total*23000)} VNĐ</td>
                <td className='text-center px-4 py-2'>
                  
                  {el?.status === 'Succeed' && <span className='text-green-500'>Đã thanh toán</span> }
                  
                  {el?.status === 'cxn' && <span className=''>Chờ xác nhận</span> }


                   {el?.status === 'dxn' && <span className=''>Đã xác nhận</span> }

                   {el?.status === 'Canceld' && <span className='text-main'>Đã hủy</span> }
                  </td>
                <td className='text-center px-4 py-2'>{moment(el?.createdAt)?.format("DD/MM/YYYY")}</td>
               
                <td className='text-center px-4 py-2'>
                <span onClick={()=>{
                  setIsShowDescriptionOrder(!isShowDescriptionOrder)
                  setIsDescriptionOrder(el)
                }}
                   
                      className='hover:underline cursor-pointer px-1 inline-block' title='Xem chi tiết đơn hàng'><CgDetailsMore /></span>
                </td>
              </tr>
            ))}
          </tbody>
      </table>



      <div className='w-full flex justify-end my-8'>
          <Pagination totalCount={count}/>
      </div>
    </div>
  )
}

export default withBaseComponent(ManagerOrder)