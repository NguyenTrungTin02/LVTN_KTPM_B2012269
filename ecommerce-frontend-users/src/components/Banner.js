import React from 'react'
import banner from '../assets/cover web 2.jpg'
import banner2 from '../assets/Web cover_Cloud L.jpg'
import banner3 from '../assets/Web cover_Keeper.jpg'
import banner4 from '../assets/Web cover_Modul.jpg'
import Slider from 'react-slick';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
  autoplaySpeed: 2000, // Set autoplay speed to 2 seconds
};

const Banner = () => {
  return (
    <div className='w-full py-2'>
        <div className=''>
            <Slider {...settings}>
              <img src={banner} alt='banner' className='w-full object-cover h-[600px]'/>
              <img src={banner2} alt='banner' className='w-full object-cover h-[600px]'/>
              <img src={banner3} alt='banner' className='w-full object-cover h-[600px]'/>
              <img src={banner4} alt='banner' className='w-full object-cover h-[600px]'/>
            </Slider>

        </div>
    </div>
  )
}

export default Banner