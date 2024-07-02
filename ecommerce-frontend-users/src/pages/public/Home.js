import React from 'react'
import { Banner, HomeCategory, Service } from '../../components'
import Seller from '../../components/Seller'
//import { useSelector } from 'react-redux'

const Home = () => {
  
  

  // const {isLoggedIn, current} = useSelector(state=>state.user)

    
  return (
    <div className='w-full'>
        <Banner/>
        <Seller/>
        <HomeCategory/>
        <Service/>
    </div>
  )
}

export default Home