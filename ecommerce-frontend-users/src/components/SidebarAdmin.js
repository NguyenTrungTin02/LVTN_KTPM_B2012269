import React, { Fragment, useState } from 'react'
import { sidebarAdmin } from '../utils/contants'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';


const activeStyle ='px-4 py-2 flex items-center gap-2  bg-blue-400'
const notActiveStyle ='px-4 py-2 flex items-center gap-2  hover:bg-blue-200'

const SidebarAdmin = () => {

    const [active, setActive] = useState([])

    const { current } = useSelector(state => state.user);

    const handleShowTab = (tabId)=>{
        if(active.some(el=>el === tabId)) setActive(prev=>prev.filter(el=>el!==tabId))
        else setActive(prev => [...prev,tabId])

    }
  return (
    <div className='bg-gray-200 h-full py-4'>
        <div className='flex justify-center gap-2 flex-col items-center py-4'>
            <img src={current?.avatar} alt='avatar' className='w-20 h-20 object-cover rounded-full'/>
            <small className='font-semibold'>Quản lý: {current?.name}</small>
        </div>
        <div>
            {sidebarAdmin.map(el=>(
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
        </div>
    </div>
  )
}

export default SidebarAdmin