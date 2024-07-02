import React, { useCallback, useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import {Button, InputFrom, Loading, MarkdownEditor,Select }from '../../components'
import { useSelector } from 'react-redux'
import {getBase64, validate} from '../../utils/helpers'
import { toast } from 'react-toastify'

import { IoCloseOutline } from "react-icons/io5";
import { apiCreateProduct, apiGetBrand } from '../../apis'
import ModelContainer from '../../components/ModelContainer'

const CreateProduct = () => {
  const {register, formState: {errors}, reset, handleSubmit,watch} = useForm()

  const [loading, setLoading] = useState(false)


  const {categories} = useSelector(state=>state.app) 
  
  const [payload,setPayload] = useState({
        description:'',
        guarantee:'',
        parameter:''
    })

 

  const [invalidFields, setInvalidFields] = useState([])

  const [preview, setPreview] = useState({
    thumb: null,
    images:[],
    model3d:null
  })
  const [brand, setBrand] = useState(null)


  const fetchAllBrand = async(params)=>{
    const response = await apiGetBrand( )
    if(response.success) setBrand(response?.brand)
  }

  useEffect(()=>{
      fetchAllBrand()
  },[])


  const [hover, setHover] = useState(null)

  const changeValue = useCallback((e)=>{
    setPayload(e)
  },[payload])



  const handlePreview3D =async(file)=>{
    const base643D = await getBase64(file)
    setPreview(prev=>({...prev, model3d: base643D}))
  }
  useEffect(() => {
    if (watch('model3d').length > 0) {
      handlePreview3D(watch('model3d')[0]);
    }
  }, [watch('model3d')]);
  



  const handlePreviewThumb =async(file)=>{
    const base64Thumb = await getBase64(file)
    setPreview(prev=>({...prev, thumb: base64Thumb}))
  }
  useEffect(()=>{
    handlePreviewThumb(watch('thumb')[0])
  },[watch('thumb')])
  

  const handlePreviewImages = async (files)=>{
    const imagePreview =[]
    for(let file of files){
      if(file.type !=='image/png' && file.type !=='image/jpeg'){
        toast.warning("File không hợp lệ")
        return
      }
      const base64 = await getBase64(file)
      imagePreview.push({name: file.name,path: base64})
    }
    setPreview(prev=>({...prev,images: imagePreview}))
  }


  useEffect(()=>{
    handlePreviewImages(watch('images'))
  },[watch('images')])


  const handleCreateProduct = async(data)=>{
    setLoading(true)
    const invalids = validate(payload,setInvalidFields)
    if(invalids === 0){
      if(data.category) data.category=categories?.find(el=>el._id===data.category)?.name
      if(data.brand) data.brand=brand?.find(el=>el._id===data.brand)?.name
      const finalPayload = {...data,...payload}
      const fromData = new FormData()
      console.log(finalPayload)
      for(let i of Object.entries(finalPayload)) fromData.append(i[0],i[1])
      if(finalPayload.thumb) fromData.append('thumb',finalPayload.thumb[0])
      if(finalPayload?.model3d) fromData.append('model3d',finalPayload?.model3d[0])
      if(finalPayload.images) {
        for(let image of finalPayload.images) 
          fromData.append('images',image)
      }
      const response = await apiCreateProduct(fromData)
      setLoading(false)
      if(response.success){
        toast.success(response.mes)
        reset()
        setPreview({
          thumb:'',
          image:[],
          model3d:''
        })

        setPayload({
          description:'',
         
          parameter:'',
          guarantee:''
        })

      } else {
        
        toast.error(response.mes)}
    }

  }
  
console.log(preview?.model3d)

  const handleRemoveImg = (name)=>{
   
    if(preview.images?.some(el=>el.name === name )) setPreview(prev=>
      
      ({...prev,images: prev.images?.filter(el=>el.name !== name)}))
  }
  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Thêm sản phẩm</span>
      </h1>  

      {loading && <div><Loading/></div>}
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
            <InputFrom
               label="Tên sản phẩm"
               register={register}
               errors={errors}
               id='title'
               validate={{
                require: "Need fill this field"
               }}
               fullWith
               placeholder="Tên sản phẩm"
            />

            <div className='w-full flex my-6 gap-4'>

            <InputFrom
               label="Giá"
               register={register}
               errors={errors}
               id='price'
               validate={{
                require: "Need fill this field"
               }}
               style='flex-auto'
               placeholder="1000, 2000,...."
               type='number'
            />

            <InputFrom
               label="Số lượng"
               register={register}
               errors={errors}
               id='quantity'
               validate={{
                require: "Need fill this field"
               }}
               style='flex-auto'
               placeholder="10,20,..."
               type='number'
            />

            <InputFrom
               label="Màu sắc"
               register={register}
               errors={errors}
               id='color'
               validate={{
                require: "Need fill this field"
               }}
               style='flex-auto'
               placeholder="Màu sắc sản phẩm"
              
            />


              {/* <InputFrom
               label="Nhà sản xuất"
               register={register}
               errors={errors}
               id='brand'
               validate={{
                require: "Need fill this field"
               }}
               style='flex-auto'
               placeholder="Nhà sản xuất"
              
            /> */}



            </div>

            <div className='w-full my-6 flex gap-4'>
              <Select
                label="Loại sản phẩm"
                options={categories?.map(el=>({code: el._id,value: el.name}))}
                register={register}
                errors={errors}
                id='category'
                validate={{require:true}}
                style='flex-auto'
              />

              <Select
                label="Thương hiệu"
                options={brand?.map(el=>({code: el._id,value: el.name}))}
                register={register}
                errors={errors}
                id='brand'
                validate={{require:true}}
                style='flex-auto'
              />
           

            </div>

            <MarkdownEditor
              name='description'
              changeValue={changeValue}
              label='Chi tiết sản phẩm'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          <div className='h-[15px]'></div>
          <MarkdownEditor
              name='parameter'
              changeValue={changeValue}
              label='Thông số sản phẩm:'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}

            />

            <div className='h-[15px]'></div>
          <MarkdownEditor
              name='guarantee'
              changeValue={changeValue}
              label='Chính sách bảo hành:'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}

            />

        <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='thumb'>Hình ảnh sản phẩm</label>
          <input type='file' 
                  id="thumb"
                  {...register('thumb',{required:'Need fill'})}/>
                   {errors['thumb'] && <small className='text-xs text-main'>{errors['thumb']?.message}</small>}
                  
          </div>
          
          {preview.thumb && <div className='my-4'>
            <img src={preview.thumb} alt="thumb" className="w-[200px] object-contain"/>
            </div>}

        <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='products'>Hình ảnh chi tiết</label>
          <input type='file' id="products" multiple
          {...register('images',{required:'Need fill'})}/>
          {errors['products'] && <small className='text-xs text-main'>{errors['products']?.message}</small>}

        </div>

        {preview.images?.length>0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
            {preview.images?.map((el,idex)=>(
              <div 
              onMouseEnter={()=>setHover(el.name)}
              onMouseLeave={()=>setHover(null)}
              className='w-fit relative' key={idex}>
                <img src={el.path}  alt="product" className="w-[200px] object-contain"/>
               {hover === el.name &&  <div className='absolute inset-0 bg-overplay'
               onClick={()=>handleRemoveImg(el.name)}
               >
                
               <IoCloseOutline  color='red' size={20}/>
                </div>}
              
               
              </div>
            ))}
            </div>}

        <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='model3d'>Mô hình 3D</label>
          <input type='file' 
                  id="model3d"
                  {...register('model3d')}
                  />
                   {/* {errors['model3d'] && <small className='text-xs text-main'>{errors['model3d']?.message}</small>} */}
        </div>

        <div className='mt-8'> <Button  type="submit">Tạo sản phẩm</Button></div>
         
              {preview.model3d && (
        <div className='my-4'>
          <ModelContainer experience={preview?.model3d}/>
         
        </div>
      )}
        </form>
      </div>
    </div>
  )
}

export default CreateProduct