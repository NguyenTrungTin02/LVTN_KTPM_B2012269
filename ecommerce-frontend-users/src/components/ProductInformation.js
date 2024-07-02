import React,{useCallback, useState} from 'react'
import { productInforTabs } from '../utils/contants'
import VoteBar from './VoteBar'
import { renderStarFromNumber } from '../utils/helpers'
import {Button, Comment, VoteProduct} from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../app/appSlice'
import { apiRating } from '../apis'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import path from '../utils/path'
import DOMPurify from 'dompurify'





const ProductInformation = ({total,ratings,nameProduct,productId,rerender,guarantee,parameter}) => {

  const [activeTab, setActiveTab] = useState(1)
  const dispatch = useDispatch()
  const {isLoggedIn} = useSelector(state=>state.user) 
  const navigate = useNavigate()

 


  const handleSubmitRating = async({comment, star})=>{
    if(!productId || !star){
      alert('Nhập đầy đủ')
    }
    await apiRating({star,comment,productId,createAt: Date.now()})
    rerender()
    dispatch(showModal({isShowModal: false, modalChildren: null}))
    
  }


  const handleRating = ()=>{
    if(!isLoggedIn) {
      Swal.fire({
        text: 'Không thể đánh giá sản phẩm. Vui lòng đăng nhập',
        cancelButtonText:'Không phải bây giờ',
        confirmButtonText:'Đăng nhập',
        title: 'Lỗi',
        icon:'error',
        showCancelButton:true
      }).then((rs)=>{
        if(rs.isConfirmed){
          navigate(`/${path.LOGIN}`)
        }
      })
    }else{
      dispatch(showModal({isShowModal: true, 
        modalChildren:<VoteProduct nameProduct={nameProduct}
        handleSubmitRating={handleSubmitRating}
        />}))
    }
  }




  return (
    <div>
        <div className='flex items-center gap-2 relative bottom-[-1px]'>
            {productInforTabs.map(el=>(
                <span key = {el.id} 
                onClick={()=>setActiveTab(el.id)}
                className={`py-2 px-4 ${activeTab=== el.id 
                ? 'bg-white border border-b-0':'bg-gray-200'}`}>{el.name}</span>
            ))}
           
        </div>
        <div className='w-full p-4 border'>
        {+activeTab === 1 &&  <div className='text-sm mb-8' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(parameter)}}></div>}
        {+activeTab === 2 &&  <div className='text-sm mb-8' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(guarantee)}}></div>}
        
       </div>

        <span className='flex mt-4 mb-0'>ĐÁNH GIÁ CỦA KHÁCH HÀNG</span>
        <div className='flex flex-col py-8 w-main'>
       
            
                <div className='flex border'>
                <div className='flex-4 flex items-center justify-center flex-col'>
                    <span className='font-semibold text-3xl'>{`${total}/5`}</span>
                    <span className='flex items-center gap-2'>{renderStarFromNumber(total)?.map((el,index)=>(
                      <span key={index}>{el}</span>
                    ))}</span>
                    <span className='font-semibold text-xxl'>{`${ratings?.length} đánh giá`}</span>
                </div>
                <div className='flex-6 border-red-500 p-4 flex flex-col gap-2'>
                    {Array.from(Array(5).keys()).reverse().map(el=>(
                      <VoteBar
                        key={el}
                        number = {el+1}
                        ratingTotal={ratings?.length}
                        ratingCount={ratings?.filter(i=>i.star === el+1)?.length}
                      />
                    ))}
                </div>
                </div>

                <div className='p-4 flex items-center text-sm justify-center'>
            <Button 
            handleOnclick={handleRating}
            
            >Đánh giá sản phẩm</Button>
          </div>
          <div className='flex flex-col gap-3'>
            {ratings?.map(el=>(
              <Comment
              key={el._id}
              star={el.star}
              createdAt={el.createAt}
              comment={el.comment}
              name={el.postedby?.name}
              avatar={el?.postedby?.avatar}
              cmId = {el?._id}
              uId = {el?.postedby}
              productId={productId}
              rerender={rerender}
              />
            ))}
          </div>
                
          
          </div>
          
          
     
    </div>
  )
}

export default ProductInformation