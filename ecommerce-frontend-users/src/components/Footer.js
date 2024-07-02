import React from 'react';

const Footer = () => {
  return (
    <div className='w-full'>
      <div className='h-[307px] bg-gray-100 flex items-center justify-center text-[13px]'>
        <div className='w-main flex items-center'>
          <div className='flex-2 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[10px]'>VỀ CHÚNG TÔI</h3>
            <span>
              <span>Địa chỉ: </span>
              <span className='opacity-79'>3/2, Xuân Khách, Ninh Kiều, Cần Thơ</span>
            </span>

            <span>
              <span>Điện thoại: </span>
              <span className='opacity-79'>(+1800) 000 8808</span>
            </span>

            <span>
              <span>Email: </span>
              <span className='opacity-79'>noithat@gmail.com</span>
            </span>
          </div>

          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>THÔNG TIN</h3>
            <span>Tiêu đề</span>
            <span>Thư viện ảnh</span>
            <span>Vị trí cửa hàng</span>
            <span>Ưu đãi hôm nay</span>
            <span>Liên hệ</span>
          </div>

          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>PHÒNG TRƯNG BÀY</h3>
            <span>Thư viện ảnh</span>
            <span>Thư viện video</span>
            <span>Thảo luận</span>
            <span>Thư viện âm thanh</span>
            <span>Cảm nhận khách hàng</span>
          </div>

          <div className='flex-1 flex flex-col gap-2'>
            <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>VỊ TRÍ CỬA HÀNG</h3>
            <span>Địa chỉ cửa hàng</span>
            <span>Bản đồ</span>
            <span>Thời gian làm việc</span>
            <span>Phản hồi</span>
            <span>Chính sách đổi trả</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
