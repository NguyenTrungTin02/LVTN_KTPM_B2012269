import React, {useEffect,useState} from 'react'
import { apiGetProduct } from '../apis/product';
import Slider from "react-slick";
import Product from './Product';


const tabs = [
    {id:1, name:'Sản phẩm nổi bật'},
    {id:2, name:'Sản phẩm mới'},
]


const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

const Seller = () => {
    const [bestSellers, setBestSellers] = useState(null); 
    const [newProduct, setNewProduct] = useState(null); 
    const [activeTab, setActive]=useState(1)
    const [product, setProduct] = useState(null);

    const fetchProduct = async() => {
        const response = await Promise.all([apiGetProduct({sort:'-sold'}),apiGetProduct({sort:'-createdAt'})]);
        if(response[0]?.success) {
            setBestSellers(response[0].products);
            setProduct(response[0].products);

        }
        if(response[1]?.success) setNewProduct(response[1].products)
    }

    useEffect(()=>{
        fetchProduct();
    },[])

    useEffect(()=>{
        if(activeTab === 1) setProduct(bestSellers);
        if(activeTab === 2) setProduct(newProduct);
    },[activeTab,bestSellers,newProduct])

  return (
    <div>
        <div className='flex text-[20px] gap-8 pt-4'>
            {tabs.map(el=>(
                <span className={`border rounded-md p-2 font-semibold capitalize text-gray-400 cursor-pointer ${activeTab===el.id ? 'text-gray-900':''}`} 
                key={el.id}
                onClick={()=>setActive(el.id)}
                >{el.name}</span>
            ))}
        </div>

        <div className='mt-4 mx-[-10px]'>
            <Slider {...settings}>
                {product?.map(el =>(
                    <Product
                    key={el._id}
                    pid={el._id}
                    productData={el}
                   />
                ))}
            </Slider>

        </div>
       
    </div>
  )
}

export default Seller