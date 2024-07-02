import React , {useEffect, useState} from 'react'

const useDebounce = (value,ms) => {

  const [debounceValue, setDebounceValue] = useState('')

  useEffect(()=>{
    const setTimeId =  setTimeout(()=>{
        setDebounceValue(value)
    },ms)

        return () =>{
            clearTimeout(setTimeId)
        }

  },[value,ms])

  return debounceValue
}
export default useDebounce