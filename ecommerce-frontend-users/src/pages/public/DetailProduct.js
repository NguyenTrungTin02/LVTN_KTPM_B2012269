import React, { useCallback, useEffect,useRef,useState } from 'react'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom' 
import { apiAGetProduct,apiGetProduct, apiUpdateCart } from '../../apis';
import { Breadcrumb, Button, ExtraInfoItem, ProductInformation, SelectQuantity } from '../../components';
import Slider from "react-slick";
import { formatMoney, renderStarFromNumber } from '../../utils/helpers';
import { productExtraInformation } from '../../utils/contants';
import CustomSiler from '../../components/CustomSiler';
import path from '../../utils/path';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import withBaseComponent from '../../hocs/withBaseComponent';
import { getCurrent } from '../../app/user/asyncActions';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import Experience from '../public/Experience'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1



};


const DetailProduct = ({dispatch,location}) => {
  const titleRef= useRef()

  const {current} = useSelector(state=>state.user)

  const {pid,category} = useParams();
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState(null)
  const [curentImg, setCurentImg] = useState(null)

  const [update, setUpdate] = useState(null)

  const [quantity, setQuantity] = useState(1)
  const [varriant, setVarriant] = useState(null)



  const [experience, setExperience]= useState(null)

  


  const [currentProduct, setCurentProduct] = useState({
    title:'',
    thumb:'',
    images:[],
    price:'',
    color:'',
    description:'',
    quantity:'',
    guarantee:'',
    parameter:'',
    sold:'',
    discount:'',
    expiration:'',
    totalDiscount:'',
    model3d:''

  })




  const navigate = useNavigate()


  useEffect(()=>{
    if(varriant){
      setCurentProduct({
        title: product?.varriants?.find(el=>el.sku === varriant)?.title,
        color: product?.varriants?.find(el=>el.sku === varriant)?.color,
        price: product?.varriants?.find(el=>el.sku === varriant)?.price,
        images: product?.varriants?.find(el=>el.sku === varriant)?.images,
        thumb: product?.varriants?.find(el=>el.sku === varriant)?.thumb,
        description: product?.varriants?.find(el=>el.sku === varriant)?.description,
        quantity: product?.varriants?.find(el=>el.sku === varriant)?.quantity,
        guarantee: product?.varriants?.find(el=>el.sku === varriant)?.guarantee,
        parameter: product?.varriants?.find(el=>el.sku === varriant)?.parameter,
        sold: product?.varriants?.find(el=>el.sku === varriant)?.sold,
        discount: product?.varriants?.find(el=>el.sku === varriant)?.discount,
        expiration: product?.varriants?.find(el=>el.sku === varriant)?.expiration,
        totalDiscount: product?.varriants?.find(el=>el.sku === varriant)?.totalDiscount,
        model3d: product?.varriants?.find(el=>el.sku === varriant)?.model3d,



      })
    }
    else{
      setCurentProduct({
        title:'',
        thumb:'',
        images:[],
        price:'',
        color:'',
        description:'',
        quantity:'',
        guarantee:'',
        parameter:'',
        sold:'',
        discount:'',
        expiration:'',
        totalDiscount:'',
        model3d:''
      })
    }
  },[varriant])

 
  const expirationDate = new Date(currentProduct?.expiration ||product?.expiration);
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  const daysLeft = (Math.ceil((expirationDate - currentDate) / oneDay)+1);
  

  const fetchProduct = async ()=>{
    const response= await apiAGetProduct(pid)
    if(response.success) {
      setProduct(response.productData)
      setCurentImg(response?.productData?.thumb)
    }
  }

  const fetchProducts = async()=>{
    const response= await apiGetProduct({category})
    setRelatedProducts(response.products)
  
  }



  useEffect(()=>{
    if(pid){
        fetchProduct()
     
    }
  
  },[update,varriant])


  useEffect(()=>{
    if(pid){
        fetchProduct()
        fetchProducts()
    }
    window.scrollTo(0,0)
    // titleRef.current.scrollIntoView({block:'start'})
  },[pid])



  const rerender= useCallback(()=>{
    setUpdate(!update)
  },[update])


  const handleClickImg = (e,el) =>{
    e.stopPropagation()
    setCurentImg(el)
  }


  const handleQuantity = useCallback((number)=>{
    if(!Number(number) || Number(number)<1 || Number(number)>(currentProduct?.quantity || product?.quantity) ) {
      return
    }
    else{
      setQuantity(number)
    }
  },[quantity])


  useEffect(()=>{
    setQuantity(1)
  },[varriant])

  const handleExperienceClick = (pid) => {
    navigate(`/${path.EXPERIENCE}${pid}`)
  };


  // const customSuccessTheme = {
  //   background: '#4CAF50', // Green background color
  //   color: '#FFFFFF', // White text color
  //   fontSize: '16px', // Font size
  //   fontWeight: 'bold', // Font weight
  // };
  

  const handleAddToCart=async()=>{
    
      if(!current) return Swal.fire({
        title:'Lỗi',
        text:'Cần phải đăng nhập',
        icon:'error',
        cancelButtonText:'Không phải bây giờ',
        showCancelButton: true,
        confirmButtonText: "Đăng nhập"

      }).then((e)=>{
        if(e.isConfirmed) navigate({
          pathname: `/${path.LOGIN}`,
          search: createSearchParams({redirect: location.pathname}).toString()
        })
      })
      const response = await apiUpdateCart({
        pid,
        color: currentProduct?.color ||product?.color,
        quantity,
        price: (daysLeft > 0 ? currentProduct?.totalDiscount : currentProduct?.price) || (daysLeft > 0 ?  product?.totalDiscount : product?.price),
        thumbnail: currentProduct?.thumb || product?.thumb,
        title: currentProduct?.title || product?.title
      })
      if(response.success) {
        dispatch(getCurrent())
        toast.success(response.mes);
        
      }
      else toast.error(response.mes)

  }

  
  

 



  const handleChangeQuantity = useCallback((flag)=>{
    if(flag==='minus' && quantity===1) return
    if(flag==='minus') setQuantity(prev=> +prev-1)
    if(flag==='plus') setQuantity(prev => Math.min(+prev + 1, currentProduct?.quantity || product?.quantity))
  },[quantity, currentProduct?.quantity, product?.quantity])
  

  return (
    <div className='w-full'>
      <div ref={titleRef} className='h-[1px] flex justify-center items-center bg-gray-100'>
          {/* <div className='w-main'>
             <Breadcrumb title={currentProduct?.title || product?.title} category={category}/>
          </div> */}
      </div>


      {experience && <Experience  experience={experience} setExperience={setExperience}/>}
      <div className='w-main m-auto mt-4 flex'>
        <div className='w-1/2 flex-col flex gap-4'>
          <img src={currentProduct?.thumb || curentImg} alt='product' className='h-[500px] w-[550px] '/>
          <div className='w-[458px]'>
          <Slider {...settings}>
              {currentProduct?.images?.length === 0 &&  product?.images?.map((el, index) => (
                <div className='' key={el}>
                  <img key={index} onClick={e=>handleClickImg(e,el)} src={el} alt='sub-product' className='h-[143px] w-[143px] object-cover border gap-2'/>
                </div>
           ))}

              {currentProduct.images.length > 0 &&  currentProduct?.images?.map((el, index) => (
                <div className='' key={el}>
                  <img key={index} onClick={e=>handleClickImg(e,el)} src={el} alt='sub-product' className='h-[143px] w-[143px] object-cover border gap-2'/>
                </div>
           ))}
          </Slider>
          </div>
        </div>
        <div className='w-1/2'>
          <h3 className='text-[30px] font-semibold'>{currentProduct?.title || product?.title}</h3>
          
          <div className='flex gap-1 items-center'>
            {renderStarFromNumber(product?.totalRating)?.map((el,index)=>(<span key={index}>{el}</span>))}
           <div className='gap-2'>
              <span className='italic pl-2 pr-1 border-l'>
                  <span className='font-semibold pr-1'>{product?.ratings.length}</span>
                  <span>Nhận xét</span>
                </span>
              <span className='italic pl-2 pr-1 border-l'>
                <span className='font-semibold pr-1'>{currentProduct?.sold || product?.sold}</span>
                <span>Đã bán</span>
              </span>
              <span className='italic pl-2 pr-1 border-l'>
                <span className='font-semibold pr-1'>{currentProduct?.quantity ||product?.quantity}</span>
                <span>Còn lại</span>
              </span>
           </div>
          </div>


          {daysLeft > 0 ? 
              <div className='flex gap-2 items-center'>
                <h3 className='text-[18px] font-semibold'><del>{`${formatMoney(currentProduct?.price || product?.price)} VNĐ`}</del></h3>
                <h3 className='text-[25px] font-semibold text-red-500'>{`${formatMoney(currentProduct?.totalDiscount || product?.totalDiscount)} VNĐ`}</h3>
                <div className=" bg-red-500 text-white px-3  text-[15px] rounded  [clip-path : polygon(100% 0%, 80% 50%, 100% 100%, 0% 100%, 0% 50%, 0 0)]">
                  <span>Giảm {currentProduct?.discount || product?.discount}%</span>
                  
              </div>
              <span className='italic pl-2 pr-1 border-b'>
                <span>Còn </span>
                <span className='font-semibold pr-1'>{daysLeft}</span>
                <span>ngày</span>
              </span>
              </div>
              :
              <h3 className='text-[25px] font-semibold'>{`${formatMoney(currentProduct?.price || product?.price)} VNĐ`}</h3>
            }

         
          <div className='flex items-center gap-4 mt-2'>
            <div className='text-sm mb-8' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(currentProduct?.description || product?.description)}}></div>
           
          </div>

          <div>
            <span className='font-bold'>Thương hiệu: </span>
            <span>{product?.brand}</span>
          </div>

          <div className='my-4 flex gap-4'> 
                <span  className='font-bold'>Màu: </span>
                <div className='flex flex-wrap gap-4 items-center w-full'>

                  <div onClick={()=>setVarriant(null)} className={clsx('flex items-center gap-2 border rounded-md p-2 cursor-pointer',!varriant && 'border-red-900 bg-overplay')}>
                  <img src={product?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover'/>
                    <span className='flex flex-col'>
                      <span>{product?.color}</span>
                      <span className='text-xm'>{formatMoney(product?.price)+ " VNĐ"}</span>
                    </span>
                  </div>

                  {product?.varriants?.map(el=>(
                    <div onClick={()=>setVarriant(el?.sku)} key={el?.sku} 
                    className={clsx('flex items-center gap-2 border rounded-md p-2 cursor-pointer',varriant === el.sku && 'border-red-900 bg-overplay')}>
                    <img src={el?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover'/>
                    <span className='flex flex-col'>
                      <span>{el?.color}</span>
                      <span className='text-xm'>{formatMoney(el?.price)+ " VNĐ"}</span>
                    </span>
                  </div>
                  ))}

                </div>
          </div>

          <div className='flex flex-col gap-8'>
           <div className='flex items-center gap-4'>
            <span className='font-semibold'>Số lượng</span>
           <SelectQuantity quantity={quantity} 
            handleChangeQuantity={handleChangeQuantity}
            handleQuantity={handleQuantity}/>
           
           </div>
              <div className='flex gap-2'>
                {(currentProduct?.quantity || product?.quantity) > 0 ? <div>
                <Button fw handleOnclick={handleAddToCart}>
                    Thêm vào giỏ hàng
                  </Button>
                </div> :<div>
                <Button>
                    Hết hàng
                  </Button>
                </div>}

        
                <div>
                <Button fw handleOnclick={() => setExperience(currentProduct?.model3d || product?.model3d)} style='px-4 py-2 rounded-md text-white text-semibold bg-blue-500 my-2'>
                    Trải nghiệm sản phẩm
                  </Button>
                </div>
              </div>

              
           </div>
        </div>



        {/* <div className='w-1/5 pl-2'>
          {productExtraInformation.map(el=>(
            <ExtraInfoItem
             key={el.id}
             title={el.title}
             sub={el.sub}
             icon={el.icon}/>
            
          ))}
          </div> */}
      </div>


      <div className='w-main m-auto mt-8'>
        <ProductInformation 
        total={product?.totalRating} 
        ratings={product?.ratings} 
        nameProduct={product?.title}
        productId={product?._id}
        rerender={rerender}
        parameter={currentProduct?.parameter || product?.parameter}
        guarantee={currentProduct?.guarantee || product?.guarantee}
        />
        </div>


      <div className='w-main m-auto my-8'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>SẢN PHẨM LIÊN QUAN</h3>
            <CustomSiler products={relatedProducts}/>
      </div>


    </div>
  )
}

export default withBaseComponent(DetailProduct)