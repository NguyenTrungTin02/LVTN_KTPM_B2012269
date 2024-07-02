import React, { useEffect } from 'react'
import usePagination from '../hooks/usePagination'
import { PagiItem } from './'
import { useSearchParams } from 'react-router-dom'

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams()
  const pagination = usePagination(totalCount, +params.get('page')||1)

  const range = () => {
    const currentPage = +params.get('page')
    const pageSize = +process.env.REACT_APP_LIMIT || 8
    const start = ((currentPage - 1) * pageSize) + 1
    const end = Math.min(currentPage * pageSize, totalCount)
    return `${start} - ${end}`
  }

  return (
    <div className='flex items-center w-full justify-between'>
      {totalCount > 0 && (
        <span className='text-sm italic'>
          {+params.get('page')
            ? `Hiển thị thông tin từ ${range()} của ${totalCount}`
            : `Hiển thị thông tin từ  1 - ${Math.min(process.env.REACT_APP_LIMIT ,totalCount)|| 8} của ${totalCount}`}
        </span>
      )}

      <div className='flex items-center'>
        {pagination?.map(el => (
          <PagiItem key={el}>
            {el}
          </PagiItem>
        ))}
      </div>
    </div>
  )
}

export default Pagination
