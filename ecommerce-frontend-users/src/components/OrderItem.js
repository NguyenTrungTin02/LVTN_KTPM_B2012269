import React, { useEffect, useState } from 'react';
import SelectQuantity from './SelectQuantity';
import { useSelector } from 'react-redux';
import { formatMoney } from '../utils/helpers';
import withBaseComponent from '../hocs/withBaseComponent';
import { updateCart } from '../app/user/userSlice';
import { apiRemoveCart } from '../apis';
import { getCurrent } from '../app/user/asyncActions';
import { toast } from 'react-toastify';

const OrderItem = ({ el, defaultQuantity = 1, dispatch, price, title, thumbnail, pid, color }) => {
  const [quantity, setQuantity] = useState(defaultQuantity);

  const handleQuantity = (number) => {
    if (+number > 1) setQuantity(number);
  };

  const handleChangeQuantity = (flag) => {
    if (flag === 'minus' && quantity === 1) return;
    if (flag === 'minus') setQuantity((prev) => prev - 1);
    if (flag === 'plus') setQuantity((prev) => prev + 1);
  };

  useEffect(() => {
    dispatch(updateCart({ pid, quantity, color }));
  }, [quantity]);

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
    <div className='w-main mx-auto font-bold grid grid-cols-6 py-3'>
        <div className='col-span-2 flex items-center justify-center'>
            <div className='flex gap-2 items-center'>
                <img src={thumbnail} alt='images' className='w-28 h-28 object-cover' style={{ maxWidth: '100%', height: 'auto' }} />
                <div className='flex flex-col gap-1'>
                    <span className='font-bold'>{title}</span>
                    <span className='text-sm'>Màu: {color}</span>
                </div>
            </div>
        </div>
        <div className='col-span-1 flex items-center justify-center'>
            <span>{formatMoney(price)} VNĐ</span>
        </div>
        <div className='col-span-1 flex items-center justify-center'>
            <SelectQuantity quantity={quantity} handleChangeQuantity={handleChangeQuantity} handleQuantity={handleQuantity} />
        </div>
        <div className='col-span-1 flex items-center justify-center'>
            <span className='text-lg'>{formatMoney(price * quantity)} VNĐ</span>
        </div>
        <div className='col-span-1 flex items-center justify-center'>
            <button onClick={() =>removeProductCart(pid,color)} className='text-red-500 hover:text-red-700'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
            </button>
        </div>
    </div>
);


};

export default withBaseComponent(OrderItem);
