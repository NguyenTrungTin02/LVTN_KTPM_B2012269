import React, { useState } from 'react'

const useModel = () => {
    const [isOpen  , setIsOpen] = useState(false)
    const closeModel = () => setIsOpen(false)
    const openModel = () => setIsOpen(true)

    return {isOpen,openModel,closeModel}

  
}

export default useModel