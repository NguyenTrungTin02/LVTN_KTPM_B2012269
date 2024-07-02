import React, { useCallback, useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { formatMoney } from '../utils/helpers';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import UpdateProduct from '../pages/admin/UpdateProduct';
import { apiAGetProduct, apiDeleteProduct } from '../apis';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
//aa
const DescriptionProduct = ({ isDescription, setIsShowDescription}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullGuarantee, setShowFullGuarantee] = useState(false);
  const [showFullParameter, setShowFullParameter] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  

  const [isDescription1, setIsDescription1] = useState(isDescription)
  

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleToggleGuarantee = () => {
    setShowFullGuarantee(!showFullGuarantee);
  };

  const handleToggleParameter = () => {
    setShowFullParameter(!showFullParameter);
  };

  const [currentProduct, setCurrentProduct] = useState({
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
    _id:'',
    category:'',
    brand:'',
    
  })
  const [update, setUpdate] = useState(false)

  const [editProduct, setEditProduct] = useState(null)

  useEffect(()=>{
    if(selectedVariant){
      setCurrentProduct({
        title: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.title,
        color: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.color,
        price: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.price,
        images: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.images,
        thumb: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.thumb,
        description: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.description,
        quantity: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.quantity,
        guarantee: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.guarantee,
        parameter: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.parameter,
        sold: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.sold,
        _id: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?._id,
        category: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.category,
        brand: isDescription1?.varriants?.find(el=>el.sku === selectedVariant)?.brand,

      })
    }
    else{
      setCurrentProduct({
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
        _id:'',
        category:'',
        brand:'',
      })
    }
  },[selectedVariant,isDescription1])

  const handleEditProduct = () => {
    if (!currentProduct.title) {
      setEditProduct(isDescription1)
    } else {
      setEditProduct(currentProduct)
    }
    
  }

  const handleRemoveProduct = () => {
    if (!currentProduct.title) {
       Swal.fire({
        title:"Chắc chắn xóa?",
        text:"Có chắc chắn xóa",
        icon: 'warning',
        
        showCancelButton: true,
        cancelButtonText:"Hủy",
        confirmButtonText:'Xóa'
    }).then(async(rs)=>{
      if(rs.isConfirmed){
        
        const response = await apiDeleteProduct(isDescription1?._id)
        if(response.success){
          toast.success(response.mes)
        }
        else{
          toast.error(response.mes)
        }
        setIsShowDescription(false)
      }
    })
    } else {
      Swal.fire({
        title:"Chắc chắn xóa?",
        text:"Có chắc chắn xóa",
        icon: 'warning',
        
        showCancelButton: true,
        cancelButtonText:"Hủy",
        confirmButtonText:'Xóa'
    }).then(async(rs)=>{
      if(rs.isConfirmed){
      
        const response = await apiDeleteProduct(currentProduct?._id)
        if(response.success){
          toast.success(response.mes)
        }
        else{
          toast.error(response.mes)
        }
       setIsShowDescription(false)
      }
    })
    }
    
  }

  const render = useCallback(async () => {
    setUpdate(!update);
    const response = await apiAGetProduct(isDescription._id);
    if (response.success) {
      const newIsDescription = response.productData;
      setIsDescription1(newIsDescription);
      
      // Kiểm tra xem variant hiện tại có tồn tại trong danh sách mới không
      const variantExists = newIsDescription.varriants.find(el => el.sku === selectedVariant);
      if (!variantExists) {
        setSelectedVariant(null); // Nếu không tồn tại, đặt selectedVariant thành null
      }
      
    }
  }, [update, selectedVariant]); // Cần thêm selectedVariant vào dependencies để useEffect được gọi mỗi khi selectedVariant thay đổi
  

 
  useEffect(()=>{
    render()
},[editProduct])
 
  

  

  return (
    <div >
      <div className='w-full flex flex-col gap-4 relative'>
      <div className='p-4 border-b w-full flex justify-between items-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Thông tin chi tiết sản phẩm</h1>
        <span className='hover:underline cursor-pointer' onClick={() => setIsShowDescription(null)}>Quay lại</span>
      </div>

      { editProduct &&
       <div className='absolute inset-0 min-h-screen z-50 bg-white'>
       <UpdateProduct editProduct={editProduct} 
       render={render} 
       setEditProduct={setEditProduct}
       setIsShowDescription={setIsShowDescription}/>
     </div>
     }
        <div>
          <span className='font-bold'>Phiên bản sản phẩm: </span>
          <div className='flex flex-wrap gap-4 items-center mt-2'>
            <div onClick={() => setSelectedVariant(null)} className={clsx('flex items-center gap-2 border rounded-md p-2 cursor-pointer', !selectedVariant && 'border-red-900 bg-overplay')}>
              <img src={isDescription1?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover'/>
              <span className='flex flex-col'>
                <span>{isDescription1?.color}</span>
                <span className='text-sm'>{formatMoney(isDescription1?.price) + " VNĐ"}</span>
              </span>
            </div>
            {isDescription1?.varriants?.map(el => (
              <div key={el?.sku} onClick={() => setSelectedVariant(el?.sku)} className={clsx('flex items-center gap-2 border rounded-md p-2 cursor-pointer', selectedVariant === el.sku && 'border-red-900 bg-overplay')}>
                <img src={el?.thumb} alt='thumb' className='w-8 h-8 rounded-md object-cover'/>
                <span className='flex flex-col'>
                  <span>{el?.color}</span>
                  <span className='text-sm'>{formatMoney(el?.price) + " VNĐ"}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-center items-center'>
          <img src={currentProduct?.thumb||isDescription1?.thumb} alt='thumb' className='w-[120px] h-[120px] mt-4' />
        </div>
        <div className='px-4 py-2 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Tên sản phẩm: </span>
            <span>{currentProduct?.title ||isDescription1?.title}</span>
          </div>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Loại sản phẩm: </span>
            <span>{currentProduct?.category|| isDescription1?.category}</span>
          </div>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Thương hiệu: </span>
            <span>{currentProduct?.brand || isDescription1?.brand}</span>
          </div>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Màu sắc: </span>
            <span>{ currentProduct?.color||isDescription1?.color}</span>
          </div>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Giá sản phẩm: </span>
            <span>{formatMoney(currentProduct?.price ||  isDescription1?.price)} VNĐ</span>
          </div>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Số lượng còn lại: </span>
            <span>{currentProduct?.quantity || isDescription1?.quantity}</span>
          </div>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Số lượng đã bán: </span>
            <span>{currentProduct?.sold || isDescription1?.sold}</span>
          </div>
        </div>
        <div className='px-4 py-2'>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Mô tả: </span>
            <span
              className={clsx('description-content', showFullDescription ? 'block' : 'truncate')}
              style={{ maxHeight: '6rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentProduct?.description || isDescription1?.description) }}
            ></span>
            <div className='cursor-pointer text-blue-500' onClick={handleToggleDescription}>
              <span>{showFullDescription ? 'Thu gọn' : 'Xem thêm'}</span>
            </div>
          </div>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Bảo hành: </span>
            <span
              className={clsx('description-content', showFullGuarantee ? 'block' : 'truncate')}
              style={{ maxHeight: '6rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentProduct?.guarantee || isDescription1?.guarantee) }}
            ></span>
            <div className='cursor-pointer text-blue-500' onClick={handleToggleGuarantee}>
              <span>{showFullGuarantee ? 'Thu gọn' : 'Xem thêm'}</span>
            </div>
          </div>
          <div className='pl-4 py-1'>
            <span className='font-bold'>Thông số kỹ thuật: </span>
            <span
              className={clsx('description-content', showFullParameter ? 'block' : 'truncate')}
              style={{ maxHeight: '6rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentProduct?.parameter || isDescription1?.parameter) }}
            ></span>
            <div className='cursor-pointer text-blue-500' onClick={handleToggleParameter}>
              <span>{showFullParameter ? 'Thu gọn' : 'Xem thêm'}</span>
            </div>
          </div>
        </div>
        <div className='flex justify-center mt-4 gap-3'>
         
         {currentProduct?.title  &&  <button onClick={handleRemoveProduct} className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'>Xóa sản phẩm</button>}
          <button onClick={handleEditProduct} className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'>Chỉnh sửa sản phẩm</button>
        </div>
        
      </div>
    </div>
  );
};

export default DescriptionProduct;
