import clsx from 'clsx'
import React from 'react'

const InputFrom = ({label, 
  disabled, register, errors,id,validate, type='text',
  placeholder,fullWith,defaultValue,style,readOnly }) => {
  return (
    <div className={clsx('flex flex-col h-[78px] gap-2',style)}>
        {label && <label htmlFor={id}>{label}</label>}
        <input
            type = {type}
            id={id}
            {...register(id,validate)}
            disabled={disabled}
            placeholder={placeholder}
            className={clsx('from-input my-auto', fullWith && 'w-full',style)}
            defaultValue={defaultValue}
            readOnly={readOnly}
            />
            {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
  )
}

export default InputFrom