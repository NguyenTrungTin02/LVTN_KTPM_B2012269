import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputFrom from './InputFrom'
import Button from './Button'
import { toast } from 'react-toastify'
import { getBase64 } from '../utils/helpers'
import Swal from 'sweetalert2'
import { apiAddVarriantProduct } from '../apis'
import MarkdownEditor from './MarkdownEditor'
import Loading from './Loading'
import ModelContainer from './ModelContainer'

const Varriants = ({varriant,setVarriant,render}) => {
  console.log(varriant)

    const {register, formState: {errors}, reset, handleSubmit,watch} = useForm()
    const [invalidFields, setInvalidFields] = useState([])

    const [loading, setLoading] = useState(false)

    const [preview, setPreview] = useState({
        thumb: null,
        images:[],
        model3d: null
      })

      const [payload,setPayload] = useState({
        description:'',
        guarantee:'',
        parameter:''
    })

      const changeValue = useCallback((e)=>{
        setPayload(e)
      },[payload])
    

    useEffect(()=>{
        reset({
            title: varriant?.title,
            price: varriant?.price,
            color: varriant?.color,
            quantity: varriant?.quantity,
            brand: varriant?.brand,
            category: varriant?.category
        });
        setPayload({
          description: typeof varriant?.description === 'object' ? varriant?.description?.join(', '): varriant?.description,
          parameter: typeof varriant?.parameter === 'object' ? varriant?.parameter?.join(', '): varriant?.parameter,
          guarantee: typeof varriant?.guarantee === 'object' ? varriant?.guarantee?.join(', '): varriant?.guarantee
        });
    },[varriant])


    const handlePreview3d =async(file)=>{
      const base643d = await getBase64(file)
      setPreview(prev=>({...prev, model3d: base643d}))
    }
    useEffect(()=>{
      if(watch('model3d') instanceof FileList && watch('model3d').length > 0) handlePreview3d(watch('model3d')[0])
    },[watch('model3d')])


    const handlePreviewThumb =async(file)=>{
        const base64Thumb = await getBase64(file)
        setPreview(prev=>({...prev, thumb: base64Thumb}))
      }
      useEffect(()=>{
        if(watch('thumb') instanceof FileList && watch('thumb').length > 0) handlePreviewThumb(watch('thumb')[0])
      },[watch('thumb')])
      
    
      const handlePreviewImages = async (files)=>{
        const imagePreview =[]
        for(let file of files){
          if(file.type !=='image/png' && file.type !=='image/jpeg'){
            toast.warning("File không hợp lệ")
            return
          }
          const base64 = await getBase64(file)
          imagePreview.push(base64)
        }
        setPreview(prev=>({...prev,images: imagePreview}))
      }
    
    
      useEffect(()=>{
        if(watch('images') instanceof FileList && watch('images').length > 0) handlePreviewImages(watch('images'))
      },[watch('images')])


    

    const handleAddVarriant= async (data)=>{
        setLoading(true)
        if(data.color === varriant.color) {
          Swal.fire("Lỗi","Màu sắc không được trùng","info")
          setLoading(false)
        }
        else{
          const finalPayload = {...data,...payload}
          const fromData = new FormData()
          for(let i of Object.entries(finalPayload)) fromData.append(i[0],i[1])
          if(finalPayload.thumb) fromData.append('thumb',finalPayload.thumb[0])
          if(finalPayload.model3d) fromData.append('model3d',finalPayload.model3d[0])
          if(finalPayload.images) {
            for(let image of finalPayload.images) 
              fromData.append('images',image)
          }
            const response = await apiAddVarriantProduct(fromData,varriant._id)
            setLoading(false)
            if(response.success){
              toast.success(response.mes)
              reset()
              setPreview({thumb: null, images:[], model3d:null})  
            } else toast.error(response.mes)
        }

    }
  return (
    <div className='w-full flex flex-col gap-4 relative'>
        <div className='p-4 border-b w-full flex justify-between items-center'> 
            <h1 className='text-3xl font-bold tracking-tight'>Thêm biến thể sản phẩm</h1>
            <span className='hover:underline cursor-pointer' onClick={()=>setVarriant(null)}>Quay lại</span>
        </div>

        {loading && <Loading/>}

        <form onSubmit={handleSubmit(handleAddVarriant)} className='p-4 flex flex-col gap-4'> 
           <div className='flex gap-4 items-center'>
           <InputFrom
                label="Tên sản phẩm"
                register={register}
                errors={errors}
                id="title"
                fullWith
                validate={{
                    require: "Need fill this field"
                   }}
                style='flex-auto'
                placeholder="tên sản phẩm"
                
            />
        
           </div>
            <div className='flex gap-4 items-center'>

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


            <InputFrom
               label="Số lượng"
               register={register}
               errors={errors}
               id='quantity'
               validate={{
                require: "Need fill this field"
               }}
               style='flex-auto'
               placeholder="Số lượng"
            />


   



            </div>


            <div className='flex gap-4 items-center'>

            <InputFrom
               label="Loại sản phẩm"
               register={register}
               errors={errors}
               id='category'
               validate={{
                require: "Need fill this field"
               }}
               style='flex-auto'
               placeholder="Loại sản phẩm"
               disabled
               
            />

            <InputFrom
               label="Thương hiệu"
               register={register}
               errors={errors}
               id='brand'
               validate={{
                require: "Need fill this field"
               }}
               style='flex-auto'
               placeholder="Thương hiệu"
               disabled
            />

            </div>

            <MarkdownEditor
              name='description'
              changeValue={changeValue}
              label='Chi tiết sản phẩm'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.description}
            />
          <div className='h-[15px]'></div>
          <MarkdownEditor
              name='parameter'
              changeValue={changeValue}
              label='Thông số sản phẩm:'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.parameter}
            />

            <div className='h-[15px]'></div>
          <MarkdownEditor
              name='guarantee'
              changeValue={changeValue}
              label='Chính sách bảo hành:'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.guarantee}
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
              className='w-fit relative' key={idex}>
                <img src={el}  alt="product" className="w-[200px] object-contain"/>
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

           <div className='mt-8'> <Button  type="submit">Tạo biến thể</Button></div>


           {preview.model3d && (
        <div className='my-4'>
          <ModelContainer experience={preview?.model3d}/>
         
        </div>
      )}
        </form>
    </div>
  )
}

export default Varriants