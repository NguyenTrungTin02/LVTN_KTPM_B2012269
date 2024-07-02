import React, { useEffect, useState } from 'react'
import { PanoramaWithObject } from '../../components'
import { useParams } from 'react-router-dom';
import { apiAGetProduct } from '../../apis';

const Experience = ({experience,setExperience}) => {


  // const {pid} = useParams();
  // const [product, setProduct] = useState(null)
  // const extractedPart = pid.substring(4);

  // const fetchProduct = async ()=>{
  //   const response= await apiAGetProduct(extractedPart)
  //   if(response.success) {
  //     setProduct(response.productData)
      
  //   }
  // }


  // useEffect(()=>{
  //   if(pid){
  //     fetchProduct()
     
  //   }
  // },[pid])


  return (
    <div className='w-[109%] ml-[-60px]'> 
      <PanoramaWithObject  experience = {experience} setExperience={setExperience} />
    </div>
  )
}

export default Experience