import React from 'react'
import Slider from 'react-slick';
import Product from './Product';


const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

const CustomSiler = ({products,activedTab}) => {
  return (
    <div>
        {products && <Slider className='custom-slider' {...settings}
        >
            {products?.map((el,index)=>(
                <Product
                key={index}
                pid={el._id}
                productData={el}
                isNew={activedTab===1 ? false:true} />
                

            ))}
            </Slider>}
    </div>
  )
}

export default CustomSiler