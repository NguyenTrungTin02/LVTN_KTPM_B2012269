import React from 'react'
import '../styles/model.css'

const Model = ({children,isOpen,close}) => {
  return (
    <article className={isOpen ? 'model is-open':'model'}>
        <button className='close-model' onClick={()=>close()}>x</button>
        <div className='model-container'>
            {children}
        </div>
    </article>
  )
}

export default Model