import React, { Fragment, useState } from 'react'
import { sidebarCustomer } from '../utils/contants'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import avatar from '../assets/avatar.jpg'

const activeStyle ='px-4 py-2 flex items-center gap-2  bg-blue-400'
const notActiveStyle ='px-4 py-2 flex items-center gap-2  hover:bg-blue-200'

const SidebarCustomer = () => {

    const [active, setActive] = useState([])

    const {current} = useSelector(state=>state.user)

    const handleShowTab = (tabId)=>{
        if(active.some(el=>el === tabId)) setActive(prev=>prev.filter(el=>el!==tabId))
        else setActive(prev => [...prev,tabId])

    }
  return (
    <div className='bg-gray-200 h-full py-4 w-[250px]'>
        <div className='w-full flex flex-col items-center justify-center py-4'>
            <img src={current?.avatar || avatar} alt='avatar' className='w-16 h-16 object-cover'/>
            <small>{`${current?.name}`}</small>
        </div>
        <div>
            {sidebarCustomer.map(el=>(
                <Fragment key={el.id}>
                    {el.type === 'SINGLE' && <NavLink to={el.path}
                    className={({isActive})=>clsx(isActive && activeStyle, !isActive && notActiveStyle)}
                    >
                        <span>{el.icon}</span>
                        <span>{el.text}</span>
                        </NavLink>}

                    {el.type === 'PARENT' && <div 
                    onClick={()=>handleShowTab(el.id)}
                    className='flex flex-col  '>
                        <div className='flex items-center justify-between gap-2 px-4 py-2  hover:bg-blue-200'>
                           <div className='flex items-center gap-2'>
                           <span>{el.icon}</span>
                            <span>{el.text}</span>
                           </div>
                           {active.some(id=>el.id) ? <FaAngleDown />: <FaAngleRight/>}
                        </div>
                        {active.some(id=>+id===+el.id) && <div 
                           
                            className='flex flex-col'>
                            {el.submenu.map(item=>(
                                <NavLink key={el.text} to={item.path}
                                onClick={e=>{e.stopPropagation()}}
                                className={({isActive})=>clsx(isActive && activeStyle, !isActive && notActiveStyle,'pl-10')}>
                                    {item.text}
                                </NavLink>
                            ))}
                        </div>}
                    </div>

                    }
                </Fragment>
            ))}

            <NavLink to={'/'} className={notActiveStyle}>Quay về</NavLink>
        </div>
    </div>
  )
}

export default SidebarCustomer