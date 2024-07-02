import React from 'react';
import avatars from '../assets/avatar.jpg';
import moment from 'moment';
import { renderStarFromNumber } from '../utils/helpers';
import { useSelector } from 'react-redux';
import { apiDeleteRating } from '../apis';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Comment = ({ image = avatars, name = 'abc', createdAt, comment, star, avatar, cmId, uId ,productId,rerender}) => {
  const { current } = useSelector(state => state.user);

  // Kiểm tra xem người dùng hiện tại có phải là tác giả của đánh giá không
  const isAuthor = current && current?._id === uId?._id;
  console.log(current._id, isAuthor)

  // Xử lý sự kiện khi người dùng nhấn vào nút xóa
  const handleDeleteComment = async() => {
    Swal.fire({
        title:"Chắc chắn xóa?",
        text:"Có chắc chắn xóa",
        icon: 'warning',
        
        showCancelButton: true,
        cancelButtonText:"Hủy",
        confirmButtonText:'Xóa'
    }).then(async(rs)=>{
      if(rs.isConfirmed){
 
        const response = await apiDeleteRating(productId,cmId)
        if(response.success){
          toast.success(response.mes)
        
        }
        else{
          toast.error(response.mes)
        }
        rerender()
      }
    })
  };

  return (
    <div className='flex gap-4'>
      <div className='flex-none'>
        <img src={avatar || image} alt='avatar' className='w-[25px] h-[25px] object-cover rounded-full' />
      </div>
      <div className='flex flex-col flex-auto'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-xxl'>{name}</h3>
          <span className='text-xs italic'>{moment(createdAt)?.fromNow()}</span>
        </div>
        <div className='flex flex-col gap-2 pl-4 mt-1 border py-2 bg-gray-100'>
          <div className='flex items-center justify-between'>
            <span className='flex items-center gap-1'>
              <span className='font-semibold'>Xếp hạng:</span>
              <span className='flex items-center gap-1'>
                {renderStarFromNumber(star)?.map((el, index) => (
                  <span key={index}>{el}</span>
                ))}
              </span>
            </span>
            {isAuthor && ( // Kiểm tra người dùng có phải là tác giả không
              <div className='mr-1 border border-round-md px-2 py-1 hover:bg-red-500'>
                <button onClick={handleDeleteComment}>Xóa</button>
              </div>
            )}
          </div>

          <span className='flex gap-1'>
            <span className='font-semibold flex-shrink-0'>Đánh giá:</span>
            <span className='flex items-center gap-1'>{comment}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
