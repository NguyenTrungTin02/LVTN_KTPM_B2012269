import React from 'react'

import {useSelector} from 'react-redux'

import {Product} from "../../components"

const WishList = () => {

  const {current} = useSelector(state=>state.user)

  

  return (
    <div className='w-full px-4'>
      <header className='text-3xl font-semibold py-4 border-b'>
        Danh sách yêu thích
      </header>

      <div className='p-4 w-full flex flex-wrap gap-4'> 

        {current?.wishlist?.map((el)=>(
          <div key={el._id} className=' rounded-md w-[320px] drop-shadow flex flex-col py-3 '>

            <Product
              pid={el._id}
              productData = {el}
            
            
            />

          </div>
        ))}

      </div>
    </div>
  )
}

export default WishList