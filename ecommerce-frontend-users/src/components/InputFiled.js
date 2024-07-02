import clsx from 'clsx'
import React from 'react'

const InputFiled = ({value,setValue,nameKey,type,invalidFields, setInvalidFields,style,fullWith,placeholder}) => {
  return (
    <div className={clsx('flex flex-col relative mb-2', fullWith && 'w-full')}>
    
        <input type={type || 'text'} 
        className={clsx('px-4 py-2 rounded-sm mt-2 border w-full placeholder:text-sm placeholder:italic',style)}
        placeholder={placeholder|| nameKey?.slice(0,1).toUpperCase()+ nameKey?.slice(1)}
        value={value}
        onChange={e=>{setValue(prev=>({...prev,[nameKey]:e.target.value}))}}
        onFocus={()=>setInvalidFields &&  setInvalidFields([])}/>

       {invalidFields?.some(el=>el.name === nameKey) && <small className='text-main text-[10px] italic'
                    >{invalidFields.find(el=>el.name === nameKey)?.mes}</small>}
    </div>
  )
}

export default InputFiled