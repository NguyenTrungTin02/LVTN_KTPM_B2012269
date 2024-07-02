import React, { useCallback, useEffect, useState } from 'react'
import { apiGetOrders } from '../../apis'
import { useForm } from 'react-hook-form'
import { CustomSelect, DescriptionOrderCustomer, InputFrom, Pagination } from '../../components'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { statusOrder } from '../../utils/contants'
import { handler } from '@tailwindcss/line-clamp'
import withBaseComponent from '../../hocs/withBaseComponent'
import { formatMoney } from '../../utils/helpers'
import { CgDetailsMore } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";


const HistoryOrder = ({navigate,location}) => {

  const [order, setOrder] = useState(null)

  const [params] = useSearchParams()

  const [count, setCount] = useState(0)

  const [isShowDescriptionOrder, setIsShowDescriptionOrder] = useState(false)

  const [isDescriptionOrder, setIsDescriptionOrder] = useState(null)


  const {register,formState:{errors},watch,setValue} = useForm()
  const q=watch('q')
  const status=watch('status')

  const fetchOrder = async(params)=>{
    const response = await apiGetOrders({
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
          Lịch sử mua hàng
      </header>


      {isShowDescriptionOrder && (
            <div className='fixed inset-0 z-50 flex justify-center items-center'>
              <div className='bg-overplay w-full h-full'>

                <DescriptionOrderCustomer

                isDescriptionOrder={isDescriptionOrder}
                render={render}
                    
                      setIsShowDescriptionOrder={setIsShowDescriptionOrder}
                      
            />
    </div>
  </div>
)}


      <div className='flex justify-end items-center px-4'>
      <form className='mt-2 mb-2' >
          {/* <InputFrom
            id='q'
            register={register}
            errors={errors}
            fullWith
            placeholder='Tìm kiếm sản phẩm.....'
          
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
          <thead>
            <tr className='bg-sky-700 text-white border-white'>
              <th className='text-center'>#</th>
              <th className='text-center'>Sản phẩm</th>
              <th className='text-center'>Tổng tiền</th>
              <th className='text-center'>Trạng thái</th>
              <th className='text-center'>Ngày mua</th>
              <th className='text-center'></th>
            </tr>
          </thead>
          <tbody>
            {order?.map((el,index)=>(
              <tr key={el._id} className='border-b-[2px]'>
                <td className='text-center'>{((+params.get('page')-1 >1 ? +params.get('page')-1:0)*process.env.REACT_APP_LIMIT)+1+index}</td>
                <td className='text-center py-2 max-w-[500px]'>
                    <span className='grid grid-cols-4 gap-4'>
                      {el.products?.map(item=>
                       <span className='flex flex-col items-center gap-2' key={item._id}>
                          <img src={item?.thumbnail} alt='thumb' className='w-8 h-8 rounded-none object-cover'/>
                          <span className='flex flex-col'>
                            <span className='text-main text-sm'>{item.title}</span>
                              <span className='flex items-center text-xs gap-2'>
                                <span>Số lượng:</span>
                                <span className='text-main'>{item.quantity}</span>
                              </span>
                          </span>
                       
                       </span>
                      )}
                    </span>

                </td>
                <td className='text-center'>{formatMoney(el?.total * 23000)} VNĐ</td>
                <td className='text-center'>

                  {el?.status === "Succeed" && <div className='text-green-500'>Đã thanh toán</div>}
                  {el?.status === "cxn" && <div>Chờ xác nhận</div>}
                  {el?.status === "Canceld" && <div className='text-main'>Đã hủy</div>}
                  {el?.status === "dxn" && <div>Đã xác nhận</div>}
                </td>
                <td className='text-center'>{moment(el?.createdAt)?.format("DD/MM/YYYY")}</td>
               
                <td>
                <td className='text-center px-4 py-2'>
               <span 
                  onClick={()=>{
                  setIsShowDescriptionOrder(!isShowDescriptionOrder)
                  setIsDescriptionOrder(el)
                }}
                   
                      className='hover:underline cursor-pointer px-1 inline-block' title='Xem chi tiết đơn hàng'><CgDetailsMore /></span>


                  
                </td>
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

export default withBaseComponent(HistoryOrder)