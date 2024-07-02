import React ,{useEffect, useState} from 'react'
import { FaChevronDown } from "react-icons/fa";
import { colors } from '../utils/contants';

import { createSearchParams, useNavigate, useParams,useSearchParams } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

const SearchItem = ({name, active,changeActive,type='checkbox'}) => {
    const navigate = useNavigate()
    const {category} = useParams()
    const [params] = useSearchParams()

    const [selected, setSelected] = useState([])
    const [price, setPrice] = useState({
        from:'',
        to:''
    })

    const handleSelect = (e) =>{
        changeActive(null)
        const already = selected.find(el => el=== e.target.value)
        if(already) setSelected(prev=>prev.filter(el=> el!== e.target.value))
        else setSelected(prev => [...prev, e.target.value])

    }



    useEffect(()=>{
        let param = []
        for(let i of params.entries()) param.push(i)
        const queries = {}
        for(let i of param) queries[i[0]] = i[1]
        if(selected.length > 0){
        
        queries.color=selected.join(',')
        queries.page=1
        
        
       } else delete queries.color
       navigate({
        pathname: `/${category}`,
        search: createSearchParams(
            queries
        ).toString()
    })
       
    },[selected])

    // useEffect(()=>{
    //     if(price.from && price.to) {
    //         if(price.from > price.to ) alert('Giá không hợp lệ')
    //     }
    // })



    const debounFrom = useDebounce(price.from,300);
    const debounTo = useDebounce(price.to,300);
    useEffect(()=>{
        let param = []
        for(let i of params.entries()) param.push(i)
        const queries = {}
        for(let i of param) queries[i[0]] = i[1]
        queries.page=1

        
        if(Number(price.from)>0) queries.from=price.from
        else delete queries.from
        if(Number(price.to)>0) queries.to=price.to
        else delete queries.to
        queries.page=1

        navigate({
            pathname: `/${category}`,
            search: createSearchParams(
                queries
            ).toString()
        })
        
     },[debounFrom,debounTo])
    
   



  return (
    <div className='p-3 text-gray-500 gap-6 relative border text-xs border-gray-800 flex justify-between items-center'
                onClick={()=>changeActive(name)}>
            <span className='capitalize'>{name}</span>
            <FaChevronDown />
            {active === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]'>
                {type==='checkbox' && <div className=''>
                    <div className='p-4 items-center flex justify-between gap-8 border-b'>
                        <span className='whitespace-nowrap'>{`${selected.length} đã chọn`}</span>
                        <span className='underline cursor-pointer' onClick={e=>{
                                e.stopPropagation()
                                setSelected([])
                                changeActive(null)
                                }}>Làm mới</span>
                    </div>
                    <div onClick={e=>e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
                        {colors.map((el,index) =>(
                           <div key={index} className='flex items-center gap-3'>

                                 <input type="checkbox" name={el}
                                 value={el}
                                 id={el}
                                 
                                 onChange={handleSelect}
                                 checked={selected.some(selectedItem => selectedItem ===el)}
                                 
                                 />

                                 <label htmlFor={el}>{el}</label>
                           </div>
                        ))}
                    </div>
                    </div>}


                {type === 'input' &&  <div>
                    
                <div onClick={e=>e.stopPropagation()} className='p-4 items-center flex justify-between gap-8 border-b'>
                        {/* <span className='whitespace-nowrap'>{`${selected.length} đã chọn`}</span> */}
                        <span className='underline cursor-pointer' onClick={e=>{
                                e.stopPropagation()
                                setPrice({from:'',to:''})
                                changeActive(null)
                                }}>Làm mới</span>
                    </div>

                    <div className='flex items-center p-2 gap-2' onClick={e=>e.stopPropagation()}>
                        
                    <div className='flex items-center gap-2'>
                        <label htmlFor='from'>Từ</label>
                        <input className='input-from border text-[20px] w-[150px]' 
                        type="number" 
                        id="from"
                        value={price.from}
                        onChange={e=>setPrice(prev=>({...prev,from: e.target.value}))}/>
                    </div>
                    
                    <div className='flex items-center gap-2'>
                        <label htmlFor='to'>đến</label>
                        <input className='input-from border text-[20px] w-[150px]' 
                        type="number" 
                        id="to"
                        value={price.to}
                        onChange={e=>setPrice(prev=>({...prev,to: e.target.value}))}/>
                    </div>
                    </div>

                    </div>}
                </div>} 
    </div>
  )
}

export default SearchItem