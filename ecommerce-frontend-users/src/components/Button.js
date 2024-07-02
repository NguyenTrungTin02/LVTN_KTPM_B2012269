import React from 'react'

const Button = ({children, handleOnclick, style,fw,type='button'}) => {
  return (
    <button
        type={type}
        className={style ? style:`px-4 py-2 rounded-md text-white text-semibold bg-red-500 my-2 ${fw?'w-full':'w-fit'}`}
        onClick={()=>{handleOnclick && handleOnclick()}}>
       
       {children}
        
    </button>
  )
}

export default Button