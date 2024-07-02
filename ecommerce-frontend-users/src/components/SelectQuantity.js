import React, { memo } from 'react'

const SelectQuantity = ({quantity, handleQuantity,handleChangeQuantity}) => {
  return (
    <div className='flex items-center cursor-pointer'>
        <span className='p-2 border-r border-black' 
        onClick={()=>handleChangeQuantity('minus')}>-</span>

        <input className='py-2 text-center outline-none w-[50px]' type='text'
         value={quantity} onChange={e=>handleQuantity(e.target.value)}
        ></input>

        <span className='p-2 border-l border-black cursor-pointer'
        onClick={()=>handleChangeQuantity('plus')}>+</span>
    </div>
  )
}

export default memo(SelectQuantity)