import React from 'react';
import { IoMdClose } from "react-icons/io";
import { formatMoney} from '../utils/helpers';
import moment from 'moment';
import Button from './Button';
import Swal from 'sweetalert2';
import { apiChangeOrder } from '../apis';
import { toast } from 'react-toastify';

const DescriptionOrder = ({ setIsShowDescriptionOrder, isDescriptionOrder }) => {
  
    console.log(isDescriptionOrder)
    // Function to handle printing the order
    const handlePrintOrder = () => {
        window.print(); // Utilize the browser's print function
        
    };

    const changeOrder = async (_id) => {
        
          
          const response = await apiChangeOrder(_id, {status:'dxn'}); // Pass 'close' as the status
          if(response.success){
            toast.success(response.mes)
          }
          else{
            toast.error(response.mes)
          }
          setIsShowDescriptionOrder(false)
          
       
    }

    const changeOrderSucced = async (_id) => {
        
          
        const response = await apiChangeOrder(_id, {status:'Succeed',products:isDescriptionOrder?.products}); // Pass 'close' as the status
        if(response.success){
          toast.success(response.mes)
        }
        else{
          toast.error(response.mes)
        }
        setIsShowDescriptionOrder(false)
        
     
  }

  const closeOrder = async (_id) => {
    Swal.fire({
      title:"Chắc chắn hủy đơn hàng?",
      text:"Có chắc chắn hủy đơn hàng",
      icon: 'warning',
      
      showCancelButton: true,
      cancelButtonText:"Quay lại",
      confirmButtonText:'Hủy đơn'
    }).then(async (rs) => {
      if(rs.isConfirmed){
        const response = await apiChangeOrder(_id, { status: "close" }); // Pass an object with status property set to "close"
        if(response.success){
          toast.success(response.mes)
        } else {
          toast.error(response.mes)
        }
        setIsShowDescriptionOrder(false)
      
      }
    })
  }
  
    

    return (
        <div className='flex justify-center items-center mt-[50px]'>
           <div className='bg-white max-w-[90vw] h-[100%] overflow-auto'>

                <div className='flex justify-end cursor-pointer hide-on-print'>
                    <IoMdClose size={24} onClick={() => setIsShowDescriptionOrder(false)} />
                </div>

                <div className='border-b w-full items-center justify-center pt-4 pb-4 flex'>
                    <h5 className='text-xl font-bold tracking-tight'>Thông tin chi tiết về đơn hàng</h5>
                </div>

                <div className='flex flex-col py-2'>
                    <div className='pl-4 py-1'>
                        <span className='font-bold'>- Tên khách hàng: </span>
                        <span>{isDescriptionOrder?.orderBy?.name}</span>
                    </div>

                    <div className='pl-4 py-1'>
                        <span className='font-bold'>- Số điện thoại: </span>
                        <span>{isDescriptionOrder?.orderBy?.mobile}</span>
                    </div>

                    <div className='pl-4 py-1'>
                        <span className='font-bold'>- Địa chỉ giao hàng: </span>
                        <span>{isDescriptionOrder?.address}</span>
                    </div>

                    <div className='pl-4 py-1'>
                        <span className='font-bold'>- Trạng thái đơn hàng: </span>
                        <span >
                            
                            {isDescriptionOrder?.status === 'Succeed' && <span className='text-green-400'>Đã thanh toán</span>}
                            {isDescriptionOrder?.status === 'cxn' && <span>Chờ xác nhận</span>}
                            {isDescriptionOrder?.status === 'dxn' && <span>Đã xác nhận</span>}

                            {isDescriptionOrder?.status === 'Canceld' && <span className='text-main'>Đã hủy</span>}
                        </span>
                    </div>

                    <div className='pl-4 py-1'>
                        <span className='font-bold'>- Ngày mua: </span>
                        <span>{moment(isDescriptionOrder?.createdAt).format("DD/MM/YYYY  HH:mm:ss")}</span>
                    </div>

                    <div className='pl-4 py-1'>
                        <span className='font-bold'>- Sản phẩm: </span>
                        <div className='pl-4 pr-4'>
                            <table className='table-auto'>

                                <thead>
                                    <tr className='border'>
                                        <th className='text-left px-4 py-2'>STT</th>
                                        <th className='text-left px-4 py-2'>Tên sản phẩm</th>
                                        <th className='text-left px-4 py-2'>Màu</th>
                                        <th className='text-left px-4 py-2'>Giá</th>
                                        <th className='text-left px-4 py-2'>Số lượng</th>
                                        <th className='text-left px-4 py-2'>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isDescriptionOrder?.products?.map((el,index)=>(
                                        <tr className='border' key={el._id}>
                                            <td className='px-4 py-2 text-center'>{index+1}</td>
                                            <td className='text-left px-4 py-2'>
                                                <span>{el?.title}</span>
                                            </td>
                                            <td className='text-left px-4 py-2'>
                                                <span>{el?.color}</span>
                                            </td>
                                            <td className='text-left px-4 py-2'>
                                                <span>{formatMoney(el?.price)} VNĐ</span>
                                            </td>
                                            <td className='text-center px-4 py-2'>
                                                <span>{formatMoney(el?.quantity)}</span>
                                            </td>
                                            <td className='text-left px-4 py-2'>
                                                <span>{formatMoney(el?.quantity * el?.price)} VNĐ</span>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className='border'>
                                        <td></td>
                                        <td className='text-left px-4 py-2'></td>
                                        <td className='text-left px-4 py-2'></td>
                                        <td className='text-left px-4 py-2'></td>
                                        <td className='text-left font-semibold px-4 py-2'>
                                            <span>Tổng cộng: </span>
                                        </td>
                                        <td className='text-left px-4 py-2'>
                                            <span className='text-main'>{formatMoney(isDescriptionOrder?.products?.reduce((sum,el)=>sum+Number(el?.price*el?.quantity),0))+' VNĐ'}</span>
                                                                                   
                                        </td>   
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end px-4 py-2 hide-on-print'>
                    <Button  style='px-4 py-2 rounded-md text-white text-semibold bg-gray-500 my-2' handleOnclick={() => setIsShowDescriptionOrder(false)}>Đóng</Button>
                    {/* Button to trigger printing */}
                    
                    {isDescriptionOrder?.status === 'Succeed' && <Button style='px-4 py-2 rounded-md text-white text-semibold bg-red-500 my-2 ml-2' handleOnclick={handlePrintOrder}>In hóa đơn</Button>}
                
                    {isDescriptionOrder?.status === 'cxn' && 
                    
                                    <div>
                                                            <Button style='px-4 py-2 rounded-md text-white text-semibold bg-blue-500 my-2 ml-2' handleOnclick={() => changeOrder(isDescriptionOrder?._id)}>Xác nhận đơn hàng</Button>
                    <Button style='px-4 py-2 rounded-md text-white text-semibold bg-red-500 my-2 ml-2' handleOnclick={() => closeOrder(isDescriptionOrder?._id)}>Hủy đơn hàng</Button>
                                    </div>
                    
                    }

                    {isDescriptionOrder?.status === 'dxn' && 
                    
                        <div>
                            
                            <Button style='px-4 py-2 rounded-md text-white text-semibold bg-blue-500 my-2 ml-2' handleOnclick={() => changeOrderSucced(isDescriptionOrder?._id)}>Thanh toán đơn hàng</Button>
                            <Button style='px-4 py-2 rounded-md text-white text-semibold bg-red-500 my-2 ml-2' handleOnclick={() => closeOrder(isDescriptionOrder?._id)}>Hủy đơn hàng</Button>                        
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

export default DescriptionOrder;
