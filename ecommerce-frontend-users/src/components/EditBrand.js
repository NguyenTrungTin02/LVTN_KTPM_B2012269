import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiUpdateBrand } from '../apis'
import { toast } from 'react-toastify'
import { getBase64 } from '../utils/helpers'
import { IoMdClose } from "react-icons/io";
import InputFrom from './InputFrom'
import Button from './Button'
import Loading from './Loading'


const EditBrand = ({editBrand, setIsShowEditBrand, render}) => {
    const {register, formState: {errors}, reset, handleSubmit,watch} = useForm()

    const [loading,setLoading] = useState(false)


    const [preview, setPreview] = useState
    ({
      thumb: null,
    })


    useEffect(()=>{
        reset({
            name: editBrand?.name || ''
        })

        setPreview({
            thumb: editBrand?.thumb || ''
        })
    },[editBrand])


    const handleEdit= async (data)=>{
        setLoading(true)
        const finalPayload = {...data}

        finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]
        const fromData = new FormData()
        for(let i of Object.entries(finalPayload)) fromData.append(i[0],i[1])
        const response = await apiUpdateBrand(fromData,editBrand._id)
        setLoading(false)
        if(response.success) {
        toast.success(response.mes)
        
        render()}
        else toast.error(response.mes)
        setIsShowEditBrand(false)
    }

    const handlePreviewThumb =async(file)=>{
        const base64Thumb = await getBase64(file)
        setPreview(prev=>({...prev, thumb: base64Thumb}))
      }

    useEffect(()=>{
        if(watch('thumb') instanceof FileList && watch('thumb').length > 0) handlePreviewThumb(watch('thumb')[0])
      },[watch('thumb')])

  return (
    <div className='flex justify-center items-center mt-[80px]'>
        <div className='bg-white w-[600px] max-h-[90vw] overflow-auto'>

          {loading && <Loading/>}

        <div className='flex justify-end cursor-pointer'>
          <IoMdClose size={24} onClick={() => setIsShowEditBrand(false)} />
        </div>

        <div className='border-b w-full items-center justify-center pt-4 pb-4 flex'>
          <h5 className='text-xl font-bold tracking-tight'>Chỉnh sửa thương hiệu</h5>
        </div>

        <div className='p-4'>
            <form className='font-semibold' onSubmit={handleSubmit(handleEdit)}>
                <InputFrom
                    label="Tên thương hiệu:"
                    register={register}
                    errors={errors}
                    id='name'
                    validate={{ required: "Không được bỏ trống" }} 
                    fullWith
                    placeholder="Tên thương hiệu"
                />


          <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='thumb'>Hình ảnh:</label>
          <input type='file' 
                  id="thumb"
                  {...register('thumb')}/>
                 
                  
          </div>
          
          {preview.thumb && <div className='my-4'>
            <img src={preview.thumb} alt="thumb" className="w-[200px] object-contain"/>
            </div>}

                <div className='mt-8 justify-end flex  gap-4'> 
                
                    
                <Button style='px-4 py-2 rounded-md text-white text-semibold bg-gray-500 my-2' handleOnclick={()=>setIsShowEditBrand(false)}>Hủy</Button>


                    <Button  type="submit">Chỉnh sửa</Button>
                
                </div>
            </form>
        </div>

        </div>

    </div>
  )
}

export default EditBrand