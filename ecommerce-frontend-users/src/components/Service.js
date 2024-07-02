import React from 'react'
import Masonry from 'react-masonry-css';
import headphone from '../assets/headphones_100x_crop_center.png'
import free from '../assets/package_100x_crop_center.png'
import changing from '../assets/changing-money_100x_crop_center.png'
import medal from '../assets/medal_1_100x_crop_center.png'
import piggy from '../assets/piggy-bank_100x_crop_center.png'
import sale from '../assets/service-02.png'

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 2,
  500: 1
};

const Service = () => {
  return (
    <div>
        <div className='px-4 w-full items-center justify-center pt-4  relative mt-[50px]'>
                <h1 className='text-[25px] font-bold text-center relative'>
                    DỊCH VỤ CỦA CHÚNG TÔI
                    
                </h1>
            </div>


            <div className='mt-10 w-main m-auto ml-[50px]'>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex mx-[-10px]"
                    columnClassName="my-masonry-grid_column">
                   
                        <div className="masonry-item w-[373px] h-[227px] mt-5">
                             <div className='flex justify-center items-center flex-col'>
                             <img src={headphone} alt={headphone} className=" w-[64px] h-[64px] object-cover mb-2" />
                             <span className='text-[16px] text-center mt-1 font-bold'>ĐẶT HÀNG TRỰC TUYẾN</span>
                            <div className="text-center text-[13px] mt-1">Tận hưởng tiện ích mua sắm một cách dễ dàng và linh hoạt từ sự thoải mái của căn nhà của bạn với nền tảng đặt hàng trực tuyến mà chúng tôi cung cấp.</div>
                             </div>
                        </div>

                        <div className="masonry-item w-[373px] h-[227px] mt-5">
                             <div className='flex justify-center items-center flex-col'>
                             <img src={free} alt={free} className=" w-[64px] h-[64px] object-cover mb-2" />
                             <span className='text-[16px] text-center mt-1 font-bold'>MIỄN PHÍ VẬN CHUYỂN</span>
                            <div className="text-center text-[13px] mt-1">Tận hưởng lợi ích bổ sung từ việc vận chuyển miễn phí trên tất cả các đơn hàng, mang các sản phẩm yêu thích của bạn trực tiếp đến cửa nhà mà không tốn thêm bất kỳ chi phí nào.</div>
                             </div>
                        </div>

                        <div className="masonry-item w-[373px] h-[227px] mt-5">
                             <div className='flex justify-center items-center flex-col'>
                             <img src={changing} alt={changing} className=" w-[64px] h-[64px] object-cover mb-2" />
                             <span className='text-[16px] text-center mt-1 font-bold'>30 NGÀY ĐỔI TRẢ</span>
                            <div className="text-center text-[13px] mt-1">Yên tâm với chính sách đổi trả không rắc rối của chúng tôi, mang lại sự yên tâm cho bạn khi biết rằng bạn có 30 ngày để trả lại bất kỳ mặt hàng nào nếu nó không đáp ứng mong đợi của bạn.</div>
                             </div>
                        </div>

                        <div className="masonry-item w-[373px] h-[227px] mt-5">
                             <div className='flex justify-center items-center flex-col'>
                             <img src={medal} alt={medal} className=" w-[64px] h-[64px] object-cover mb-2" />
                             <span className='text-[16px] text-center mt-1 font-bold'>SẢN PHẨM CHẤT LƯỢNG TỐT NHẤT</span>
                            <div className="text-center text-[13px] mt-1">Trải nghiệm sự xuất sắc với bộ sưu tập sản phẩm chất lượng hàng đầu của chúng tôi, được lựa chọn kỹ lưỡng để đảm bảo chất lượng và sự hài lòng của khách hàng cao nhất.</div>
                             </div>
                        </div>

                        <div className="masonry-item w-[373px] h-[227px] mt-5">
                             <div className='flex justify-center items-center flex-col'>
                             <img src={piggy} alt={piggy} className=" w-[64px] h-[64px] object-cover mb-2" />
                             <span className='text-[16px] text-center mt-1 font-bold'>TIẾT KIỆM TIỀN CỦA BẠN</span>
                            <div className="text-center text-[13px] mt-1">Tối đa hóa sự tiết kiệm của bạn với giá cả cạnh tranh và các ưu đãi độc quyền của chúng tôi, giúp bạn có được nhiều giá trị hơn cho số tiền của mình mà không cần phải hy sinh chất lượng.</div>
                             </div>
                        </div>

                        <div className="masonry-item w-[373px] h-[227px] mt-5">
                             <div className='flex justify-center items-center flex-col'>
                             <img src={sale} alt={sale} className=" w-[64px] h-[64px] object-cover mb-2" />
                             <span className='text-[16px] text-center mt-1 font-bold'>ƯU ĐÃI ĐẶC BIỆT</span>
                            <div className="text-center text-[13px] mt-1">Tối đa hóa sự tiết kiệm của bạn với giá cả cạnh tranh và các ưu đãi độc quyền của chúng tôi, giúp bạn có được nhiều giá trị hơn cho số tiền của mình mà không cần phải hy sinh chất lượng.</div>
                             </div>
                        </div>
                    
                    
                </Masonry>
            </div>
    </div>
  )
}

export default Service