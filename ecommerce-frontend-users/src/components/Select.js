import clsx from 'clsx'
import React from 'react'

const Select = ({label,options=[],register,errors,id,validate,style,fullWith,defaultValue}) => {
  return (
    <div className={clsx('flex flex-col gap-2',style)}>
        {label && <label htmlFor={id}>{label}</label>}
        <select className={clsx('from-select', fullWith && 'w-full')} 
        defaultValue={defaultValue}
        id={id} {...register(id,validate)}>
            <option value="">-----Chọn-----</option>
            {options.map((option) => (
              <option key={option.code} value={option.code}>
                {option.value}
              </option>
        ))}

        </select>
        {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
  )
}

export default Select