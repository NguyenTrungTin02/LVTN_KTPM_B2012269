import React from 'react'

const SelectInput = ({value, changeValueSort, option}) => {
  return (
    <select className='from-select' value={value} 
    onChange={e=>changeValueSort(e.target.value)}>
        {option?.map(el=>(
            <option key={el.id} value={el.value}>{el.text}</option>
        ))}
    </select>
  )
}

export default SelectInput