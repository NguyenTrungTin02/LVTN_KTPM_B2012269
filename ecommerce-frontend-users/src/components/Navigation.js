import React from 'react'
import { NavLink } from 'react-router-dom'
import { navigation } from '../utils/contants'

const Navigation = () => {
  return (
    <div className='w-main h[48px] py-2 border-b'>
        {navigation.map(el=>(
            <NavLink to={el.path} key={el.id} 
            className={({isActive})=> isActive ? 'pr-12 hover:text-main text-main':'pr-12 hover:text-main'}>
                {el.value}
            </NavLink>
        ))}
    </div>
  )
}

export default Navigation