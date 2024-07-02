import React from 'react';
import { PanoramaWithObject } from '../../components';
import images from '../../assets/images.jpg';

const Post = () => {
  return (
    <div className='w-main flex flex-col items-center'>
      <h1 className='h-[75px] flex justify-center items-center text-3xl font-bold px-4 border-b it'>
        <span>Về chúng tôi</span>
      </h1>

      <span className='mt-4'>
        Được thành lập vào năm 2015, cửa hàng nội thất của chúng tôi có trụ sở tại thành phố Cần Thơ, một trong những trung tâm kinh tế và văn hóa của miền Tây Nam bộ Việt Nam. Tại đây, chúng tôi không chỉ là một nơi để mua sắm, mà còn là một không gian trải nghiệm đầy cảm hứng cho khách hàng của mình.
      </span>
      <br />

      <div className="flex flex-row justify-center items-start">
        <img src={images} alt='images' className='w-[500px] h-[500px] mt-[15px] mb-[15px]' />

        <div className="ml-8">
          <span>
            Câu chuyện của chúng tôi xoay quanh vẻ đẹp, sự thoải mái và chức năng của từng món đồ nội thất. Chúng tôi tin rằng mỗi mẫu sản phẩm không chỉ là một món đồ thông thường, mà còn là một tác phẩm nghệ thuật, một phần của cuộc sống hàng ngày của khách hàng.
          </span>
          <br />
          <span>
            Chúng tôi không chỉ tập trung vào việc cung cấp những sản phẩm chất lượng, mà còn vào việc tạo ra những không gian sống đẹp đẽ và ấm cúng. Chúng tôi luôn lắng nghe và hiểu được nhu cầu và ý kiến phản hồi của khách hàng, từ đó tạo ra những sản phẩm phản ánh chính xác nhất nhu cầu của họ.
          </span>
          <br />
          <span>
            Bởi vì chúng tôi tin rằng mỗi ngôi nhà là một câu chuyện, là biểu hiện của cá nhân và cá tính của chủ nhân. Do đó, chúng tôi không chỉ cung cấp các sản phẩm, mà còn chia sẻ cách nhìn nhận và sắp xếp không gian sống sao cho phản ánh tốt nhất cá tính của từng người.
          </span>
          <br />
          <span>
            Bạn đã sẵn sàng nghe câu chuyện của chúng tôi chưa? Hãy đến với chúng tôi, và chúng tôi sẽ cùng nhau khám phá và tạo ra những không gian sống đẹp nhất cho cuộc sống của bạn.
          </span>
        </div>
      </div>
      <br/>
     
    </div>
  );
};

export default Post;
