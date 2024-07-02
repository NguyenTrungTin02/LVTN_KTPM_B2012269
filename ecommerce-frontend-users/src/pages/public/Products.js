import React, { useCallback, useEffect,useState } from 'react'
import { createSearchParams, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumb, InputFrom, Pagination, Product, SearchItem, SelectInput } from '../../components'
import { apiGetProduct } from '../../apis'
import Masonry from 'react-masonry-css'
import { sorts } from '../../utils/contants'
import { useForm } from 'react-hook-form'
import useDebounce from '../../hooks/useDebounce'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const Products = () => {
  const [products, setProducts] = useState(null)
  const [active, setActive] = useState(null)
  const [sort, setSort] = useState('')

  const [params] = useSearchParams()

  const navigate = useNavigate();

  const {category} = useParams()
  console.log(category)

  const fetchProductByCategory = async (queries)=>{
    if(category &&  category !== ":category") queries.category=category
    const response = await apiGetProduct(queries)
    if(response.success) setProducts(response)
  }
  const {register,formState:{errors},watch,setValue} = useForm()
  


  useEffect(()=>{
    const queries=Object.fromEntries([...params])
    let priceQuery ={}


    
    if(queries.from && queries.to){

      priceQuery = {$and:[
        {price: {gte: queries.from}},
         {price: {lte:queries.to}}
      ]}
      
      delete queries.price
      
    } else{
      if(queries.from){
        queries.price = {gte: queries.from} 
        
      }
      
      if(queries.to){
        queries.price = {lte: queries.to}
        
      }
    }

    delete queries.to
    delete queries.from
    

    fetchProductByCategory({...queries,...priceQuery})
    window.scrollTo(0,0)
  },[params])


  const changeActive = useCallback((name)=>{
      if(active===name) setActive(null)
      else setActive(name)
  },[active])



  const changeValueSort = useCallback((value)=>{
        setSort(value)
  },[sort])


  useEffect(()=>{
    if(sort){
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({sort}).toString()
    })
    }

  },[sort])
  

  const queryDecounce= useDebounce(watch('q'),800)


  const [update, setUpdate] = useState(false)
  const location = useLocation()

  useEffect(()=>{
    if(queryDecounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({q: queryDecounce}).toString()
      })
      
    }
    else{
      navigate({
        pathname: location.pathname,
      })
    }
  },[queryDecounce])

  

  useEffect(()=>{
      const searchParams = Object.fromEntries([...params])
      delete searchParams.to
      delete searchParams.from
      fetchProductByCategory(searchParams)
  },[params,update])


  return (
    <div>
      {/* <div className='h-[40px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
            <h3 className='font-semibold'>{category}</h3>
            <Breadcrumb category={category}/>
        </div>

       
      </div> */}
      <div className='w-main border p-4 flex justify-between m-auto mt-8'>
          <div className='w-2/5 flex-auto flex flex-col gap-3'>
            <span className='font-semibold  text-sm'>Lọc sản phẩm:</span>
              <div className='flex items-center gap-4'>
                <SearchItem name='Giá tiền'
                  active={active}
                  changeActive={changeActive}
                  type='input'
                />


                <SearchItem name='Màu sắc'
                active={active}
                  changeActive={changeActive}/>
              </div>
          </div>

          <div className='w-2/5 flex flex-col gap-3 mt-5'>
          <form className='w-[50%] gap-4 ' >
          <InputFrom
            id='q'
            register={register}
            errors={errors}
            fullWith
            placeholder='Tìm kiếm sản phẩm.....'
          
          />

       

        </form>
          </div>

      

       
          <div className='w-1/5 flex flex-col gap-3'>
              <span className='font-semibold  text-sm'>Tìm kiếm theo:</span>
              <div className='w-full'>
                    <SelectInput value={sort} option={sorts} changeValueSort={changeValueSort} className='border'/>
              </div>
          </div>

          
        </div>
        <div className='mt-8 w-main m-auto'>
          <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid flex mx-[-10px]"
                columnClassName="my-masonry-grid_column">
                {products?.products?.map(el=>(
                  <Product
                    key={el._id}
                    pid={el._id}
                    productData={el}
                    normal={true}
                  />
                ))}
              </Masonry>
          </div>
          <div className='w-main m-auto my-4 flex justify-end'>
                <Pagination totalCount={products?.counts}
              />
          </div>
    </div>
  )
}

export default Products