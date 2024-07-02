import React from 'react';

const Contact = () => {
  return (
    <div className='w-full flex justify-center items-center'>
      <div className='w-[80%]'>
        <h1 className='text-4xl font-bold text-center mb-4'>Liên hệ với chúng tôi</h1>
        <div className="p-4">
          <p className="text-lg">Chúng tôi rất vui lòng được nghe từ bạn. Hãy liên hệ với chúng tôi qua một trong những cách sau:</p>
          <ul className="mt-4">
            <li><span className="font-bold">Email:</span> example@example.com</li>
            <li><span className="font-bold">Điện thoại:</span> 0123 456 789</li>
            <li><span className="font-bold">Địa chỉ:</span> 123 Đường ABC, Phường XYZ, Quận HLM, TP. Hồ Chí Minh</li>
          </ul>
        </div>
      </div>
      {/* Thẻ div trống để tạo khoảng cách giữa nội dung và footer */}
      <div className="h-[600px]"></div>
    </div>
  );
};

export default Contact;
