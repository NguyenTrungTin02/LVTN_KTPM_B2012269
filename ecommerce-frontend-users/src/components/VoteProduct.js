import React, {useEffect, useRef,useState} from 'react'
import { voteOption } from '../utils/contants'
import { FaStar } from "react-icons/fa";
import Button from './Button';
import { handler } from '@tailwindcss/line-clamp';


const VoteProduct = ({nameProduct,handleSubmitRating}) => {

  const modelRef = useRef()
  const [chosenStar, setChosenStar] = useState(null)
  const [comment, setComment]  = useState('')
  const [star, setStar]  = useState(null)
  

  useEffect(()=>{
    modelRef.current.scrollIntoView({block: 'center' , behavior: 'smooth' })

  },[])
  return (
    <div ref={modelRef} 
    className='bg-white w-[700px] p-4 flex items-center justify-center flex-col'
    onClick={e=>e.stopPropagation()}>
     
      <h2  className='text-center text-medium text-lg pb-4'>{`Đánh giá cho sản phẩm ${nameProduct}`}</h2>
        <textarea 
        className='form-textarea w-full border-2 border-black' 
        value={comment}
        onChange={e=>setComment(e.target.value)}
        ></textarea>
        <div className='w-full flex flex-col gap-4'>
          <p>Bạn cảm thấy sản phẩm như thế nào</p>
          <div className='flex items-center justify-center gap-4'>
            {voteOption.map(el=>(
              <div key={el.id} 
              className='items-center justify-center flex flex-col gap-2 w-[100px] h-[100px]'
              onClick={()=>{
                setChosenStar(el.id)
                setStar(el.id)
              }}>
                {(Number(chosenStar)&& chosenStar>=el.id) ? <FaStar color='orange'/> : <FaStar color='gray'/>}
                <span>{el.text}</span>

              </div>
            ))}
          </div>
      </div>

      <Button fw handleOnclick={()=>{handleSubmitRating({comment, star})}}>Gửi</Button>
      
      </div>

     
  )
}

export default VoteProduct