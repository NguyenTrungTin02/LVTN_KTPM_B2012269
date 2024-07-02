import React, { useState } from 'react';
import { SelectOption } from './';
import { Link, useNavigate } from 'react-router-dom';
import path from '../utils/path';
import { formatMoney, renderStarFromNumber } from '../utils/helpers';
import { IoEyeOutline } from "react-icons/io5";
import { BsCartPlus } from "react-icons/bs";
import { IoIosHeartEmpty } from "react-icons/io";
import withBaseComponent from '../hocs/withBaseComponent';
import { apiUpdateCart, apiUpdateWishList } from '../apis';
import { toast } from 'react-toastify';
import { getCurrent } from '../app/user/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { BsCartCheck } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";

const Product = ({ productData, pid }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const discountPrice = productData?.price - (productData?.price* (productData?.discount / 100)) // 30% off
  const expirationDate = new Date(productData.expiration);
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  const daysLeft = (Math.ceil((expirationDate - currentDate) / oneDay)+1);
  const [showOption, setShowOption] = useState(false);
  const { current } = useSelector(state => state.user);

  const handleClickOptions = async (e, flag) => {
    e.stopPropagation();
    if (flag === 'CART') {
      if (!current) return Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng đăng nhập',
        icon: 'error',
        cancelButtonText: 'Không phải bây giờ',
        showCancelButton: true,
        confirmButtonText: "Đăng nhập"
      }).then((e) => {
        if (e.isConfirmed) navigate(`/${path.LOGIN}`);
      });
      const response = await apiUpdateCart({
        pid: productData?._id,
        color: productData?.color,
        quantity: 1,
        price: daysLeft>0 ? productData?.totalDiscount : productData?.price,
        thumbnail: productData?.thumb,
        title: productData?.title,
      });
      if (response.success) {
        toast.success(response.mes);
        dispatch(getCurrent());
      } else toast.error(response.mes);
    }
    if (flag === 'WISHLIST') {
      if (!current) return Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng đăng nhập',
        icon: 'error',
        cancelButtonText: 'Không phải bây giờ',
        showCancelButton: true,
        confirmButtonText: "Đăng nhập"
      }).then((e) => {
        if (e.isConfirmed) navigate(`/${path.LOGIN}`);
      });
      const response = await apiUpdateWishList(pid);
      if (response.success) {
        dispatch(getCurrent());
        toast.success(response.mes);
      } else toast.error(response.mes);
    }
  };

  


  return (
    <div className='w-full text-base px-[10px]'>
      <div onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
        className='w-full border rounded-md p-[15px] flex flex-col items-center relative'
        onMouseEnter={e => { e.stopPropagation(); setShowOption(true); }}
        onMouseLeave={e => { e.stopPropagation(); setShowOption(false); }}>
        <div className='w-full relative'>
          {showOption &&
            <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-top'>
              <span onClick={(e) => handleClickOptions(e, 'CART')}>
                <SelectOption icon={<BsCartPlus />} />
              </span>
              <span onClick={(e) => handleClickOptions(e, 'WISHLIST')}>
                <SelectOption icon={<FaHeart color={current?.wishlist?.some((i) => i._id === pid) ? "red" : "black"} />} />
              </span>
            </div>}
          <img src={productData?.thumb || ''} alt='' className='w-[305px]  h-[300px]' />
          {/* Hiển thị nhãn giảm giá và số ngày còn lại */}
        {daysLeft > 0 && 
            <div className="absolute top-0 left-[-15px] bg-red-500 text-white px-2  text-[15px] rounded  [clip-path : polygon(100% 0%, 80% 50%, 100% 100%, 0% 100%, 0% 50%, 0 0)]">
            <span>- {productData?.discount}%</span>
          </div>
        }
        </div>
        <div className='flex flex-col gap-2 mt-[15px] items-start w-full relative'>

        {daysLeft > 0 && <span className='text-[13px] top-[-23px] absolute text-main italic'>Còn {daysLeft} ngày</span>}
         
        <span className='line-clamp-1'>{productData?.title}</span>
              
          
          {/* <span className='flex'>
            {renderStarFromNumber(productData?.totalRating)?.map((el, index) => (<span key={index}>{el}</span>))}
          </span> */}
          {daysLeft > 0 ? <div className='flex gap-2'>
            <span className='text-[15px]'><del>{`${formatMoney(productData?.price)} VNĐ`}</del></span>
            <span className='text-[20px] text-main'>{`${formatMoney(discountPrice)} VNĐ`}</span>
          </div> : <span className=''>{`${formatMoney(productData?.price)} VNĐ`}</span>}
        </div>
      </div>
    </div>
  );
};

export default Product
