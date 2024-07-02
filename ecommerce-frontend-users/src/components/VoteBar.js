import React, {useEffect, useRef} from 'react'
import { FaStar } from "react-icons/fa";
const VoteBar = ({number, ratingCount,  ratingTotal} ) => {


  const percentRef = useRef()

  useEffect(()=>{
    const a= Math.round(ratingCount*100/ratingTotal) || 0
    percentRef.current.style.cssText = `right : ${100-a}%`
  },[ratingCount,ratingTotal])
  return (
    <div className='flex items-center gap-2'>
        <div className='flex items-center justify-normal gap-1 text-sm w-[5%]'>
            <span className='flex-end'>{number}</span>
            <FaStar  color='orange'/>
        </div>
        <div className='w-[75%]'>
            <div className='w-full h-[5px] bg-gray-200 rounded-l-full rounded-r-full relative'>
                <div ref={percentRef}  className='absolute inset-0 bg-red-600 rounded-l-full rounded-r-full' ></div>
            </div>
        </div>
        <div className='text-gray-400 w-[15%]'>{`${ratingCount || 0} đánh giá`}</div>
    </div>
  )
}

export default VoteBar