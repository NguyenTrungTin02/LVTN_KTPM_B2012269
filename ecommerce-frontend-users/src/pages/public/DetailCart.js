import React from 'react'
import { useSelector } from 'react-redux'
import withBaseComponent from '../../hocs/withBaseComponent'
import { Breadcrumb, Button, OrderItem} from '../../components'
import { formatMoney } from '../../utils/helpers'
import { updateCart } from '../../app/user/userSlice'
import { Link } from 'react-router-dom'
import path from '../../utils/path'


const DetailCart = ({location,dispatch}) => {

    const {currentCart} = useSelector(state=>state.user)


    console.log(currentCart)

    
    
   
    
    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center '>
                <div className='w-main'>
                    <h3 className='font-semibold'>GIỎ HÀNG CỦA BẠN</h3>
                    {/* <Breadcrumb category={location?.pathname?.replace('/','')?.split('-')?.join(' ')}/> */}
                </div>
            </div>
    
            <div className='flex flex-col border my-8 mx-auto'>
                <div className='w-main mx-auto font-bold grid grid-cols-6 py-3 border-b'>
                    <span className='col-span-2 w-full text-center'>Sản phẩm</span>
                    <span className='col-span-1 w-full text-center'>Giá</span>
                    <span className='col-span-1 w-full text-center'>Số lượng</span>
                    <span className='col-span-1 w-full text-center'>Thành tiền</span>
                    <span className='col-span-1 w-full text-center'>Xóa</span>
                </div>
                {currentCart?.map(el=>(
                    <OrderItem  key={el?._id} 
                        defaultQuantity={el?.quantity}
                        color={el?.color}
                        title={el?.title}
                        thumbnail={el?.thumbnail}
                        price={el?.price}
                        pid={el.product?._id}
                    />
                ))}
            </div>
    
            <div className='w-main mx-auto flex flex-col justify-center items-end gap-3 mb-12'>
                <span className='flex items-center gap-8 text-lg'>
                    <span>Tổng tiền: </span>
                    <span className='font-bold'>{`${formatMoney(currentCart?.reduce((sum,el)=>+el?.price* el?.quantity +sum,0 ))} VNĐ`}</span>
                </span>
                {currentCart?.length > 0 && <Link className='bg-red-400 rounded-md px-4 py-2 ' to={`/${path.CHECK_OUT}`}>Thanh toán</Link>}
            </div>
        </div>
    );
    
}

export default withBaseComponent(DetailCart)