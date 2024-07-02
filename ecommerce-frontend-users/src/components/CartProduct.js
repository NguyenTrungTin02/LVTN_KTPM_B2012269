import React from 'react'
import { IoMdClose } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import withBaseComponent from '../hocs/withBaseComponent';
import { showCart } from '../app/appSlice';
import { useSelector } from 'react-redux';
import { formatMoney } from '../utils/helpers';
import Button from './Button';
import { apiRemoveCart } from '../apis';
import { toast } from 'react-toastify';
import { getCurrent } from '../app/user/asyncActions';
import path from '../utils/path';

const CartProduct = ({dispatch,navigate}) => {

  const {currentCart} = useSelector(state=>state.user) 

 

  const {current} = useSelector(state=>state.user) 
 

  
  
  const removeProductCart= async(pid,color)=>{
    const response = await apiRemoveCart(pid,color)
    if(response.success){
      dispatch(getCurrent())
    }
    else{
      toast.error(response.mes)
    }
  }




  return (
    <div onClick={e=>e.stopPropagation()} className='w-[400px] h-screen grid grid-rows-10 overflow-y-auto bg-white p-6'>
        <header className='border-b border-gray-300 font-bold text-2xl flex  row-span-1 h-full
        justify-between items-center'>
          <span>Giỏ hàng của bạn</span>
          <span onClick={()=>dispatch(showCart())} className='cursor-pointer'>  <IoMdClose  size={24} /></span>
        </header>

        <section className='row-span-7 gap-3 h-full max-h-full overflow-y-auto py-3 flex flex-col'>
          {!currentCart && <span className='text-xs italic'>Giỏ hàng trống</span>}
          {currentCart && currentCart?.map(el=>(
            <div className='flex gap-2 justify-between items-center' key={el?._id}>
                <div className='flex gap-2'>
                <img src={el?.thumbnail} alt='thumb' className='w-16 h-16 object-cover'/>
                <div className='flex flex-col gap-1'>
                  <span className='font-bold'>{el?.title}</span>
                  <span className='text-[13px]'>Màu: {el?.color}</span>
                  <span className='text-[13px]'>{`Số lượng: ${el?.quantity}`}</span>
                  <span className='text-sm'>Giá: {formatMoney(el?.price)+' vnđ'}</span>
                </div>
                </div>
                <span onClick={()=>removeProductCart(el?.product?._id,el?.color)}
                className='h-8 w-8 rounded-full flex items-center justify-center cursor-auto'><RiDeleteBin6Line /></span>
            </div>
          ))}
        </section>

        <div className='row-span-2 flex flex-col justify-between h-full mb-[80px] '> 
           <div className='flex items-center  justify-between pt-4 border-t'>
              <span>Tổng giá:</span>
              <span>{formatMoney(currentCart?.reduce((sum,el)=>sum+Number(el?.price*el?.quantity),0))+' vnđ'}</span>
           </div>
           <Button 
           style='rounded-none w-full py-3 bg-main bg-red-500 mb-[50px]' 
           
           handleOnclick={()=>{
            dispatch(showCart())
            navigate(`/${path.DETAIL_CART}`)
           }} >Chi tiết giỏ hàng</Button>
        </div>

        
        
    </div>
  )
}

export default withBaseComponent(CartProduct)