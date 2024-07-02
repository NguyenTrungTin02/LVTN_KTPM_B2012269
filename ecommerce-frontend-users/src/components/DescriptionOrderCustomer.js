import React from 'react'
import { IoMdClose } from "react-icons/io";
import { formatMoney } from '../utils/helpers';
import moment from 'moment';
import Button from './Button';
import { apiChangeOrder } from '../apis';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const DescriptionOrderCustomer = ({ setIsShowDescriptionOrder, isDescriptionOrder,render }) => {
  
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
        render()
      }
    })
  }
  

  
  

  return (
    <div className='flex justify-center items-center mt-[50px]'>
      <div className='bg-white max-w-[90vw] max-h-[90vw] overflow-auto'>

        <div className='flex justify-end cursor-pointer'>
          <IoMdClose size={24} onClick={() => setIsShowDescriptionOrder(false)} />
        </div>

        <div className='border-b w-full items-center justify-center pt-4 pb-4 flex'>
          <h5 className='text-xl font-bold tracking-tight'>Thông tin chi tiết về đơn hàng</h5>
        </div>

        <div className='flex flex-col py-2'>

          <div className='pl-4 py-1'>
            <span className='font-bold'>- Trạng thái đơn hàng: </span>
            {isDescriptionOrder?.status === 'Succeed' && <span>Đã thanh toán</span>}
            {isDescriptionOrder?.status === 'cxn' && <span>Chờ xác nhận</span>}
            {isDescriptionOrder?.status === 'Canceld' && <span>Đã hủy</span>}
            {isDescriptionOrder?.status === 'dxn' && <span>Đã xác nhận</span>}
          </div>

          <div className='pl-4 py-1'>
            <span className='font-bold'>- Ngày mua: </span>
            <span>{moment(isDescriptionOrder?.createdAt).format("DD/MM/YYYY  HH:mm:ss")}</span>
          </div>

          <div className='pl-4 py-1'>
            <span className='font-bold'>- Địa chỉ giao hàng: </span>
            <span>{isDescriptionOrder?.address}</span>
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
                  {isDescriptionOrder?.products?.map((el, index) => (
                    <tr className='border' key={el._id}>
                      <td className='px-4 py-2 text-center'>{index + 1}</td>
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
                  <tr className=''>
                    <td></td>
                    <td className='text-left px-4 py-2'>
                      <span></span>
                    </td>
                    <td className='text-left px-4 py-2'>
                      <span></span>
                    </td>
                    <td className='text-left px-4 py-2'>
                      <span></span>
                    </td>
                    <td className='text-left font-semibold px-4 py-2'>
                      <span>Tổng cộng: </span>
                    </td>
                    <td className='text-left px-4 py-2'>
                      <span className='text-main'>{formatMoney(isDescriptionOrder?.products?.reduce((sum, el) => sum + Number(el?.price * el?.quantity), 0)) + ' VNĐ'}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className='flex justify-end'>
            <div className='flex justify-end px-2 py-2'>
              <Button style='px-4 py-2 rounded-md text-white text-semibold bg-gray-500 my-2' handleOnclick={() => setIsShowDescriptionOrder(false)}>Đóng</Button>
            </div>
            {isDescriptionOrder?.status === 'cxn' &&
              <div className='flex justify-end px-2 py-2'>
              <Button style='px-4 py-2 rounded-md text-white text-semibold bg-red-500 my-2' handleOnclick={() => closeOrder(isDescriptionOrder?._id)}>Hủy đơn hàng</Button>


              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DescriptionOrderCustomer;
