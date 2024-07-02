import React, { useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form';
import { IoMdClose } from "react-icons/io";
import InputFrom from './InputFrom';
import Button from './Button';
import { apiAddCategory } from '../apis';
import { toast } from 'react-toastify';
import { getBase64 } from '../utils/helpers';
import Loading from './Loading';

const CreateProCategory = ({setIsShowAddCategory}) => {

    const {register, formState: {errors}, reset, handleSubmit,watch} = useForm()


    const [loading, setLoading] = useState(false)


    const [preview, setPreview] = useState({
      thumb: null,
    })


    const handleAdd= async (data)=>{
        setLoading(true)
        const finalPayload = {...data}
        const fromData = new FormData()
        for(let i of Object.entries(finalPayload)) fromData.append(i[0],i[1])
        if(finalPayload.thumb) fromData.append('thumb',finalPayload.thumb[0])
        const response = await apiAddCategory(fromData)
        setLoading(false)
        if(response.success) toast.success(response.mes)
        else toast.error(response.mes)
        setIsShowAddCategory(false)
    }

    const handlePreviewThumb =async(file)=>{
      const base64Thumb = await getBase64(file)
      setPreview(prev=>({...prev, thumb: base64Thumb}))
    }


    useEffect(()=>{
      handlePreviewThumb(watch('thumb')[0])
    },[watch('thumb')])

  return (
    <div className='flex justify-center items-center mt-[80px]'>
        <div className='bg-white w-[600px] max-h-[90vw] overflow-auto'>

        {loading && <Loading/>}

        <div className='flex justify-end cursor-pointer'>
          <IoMdClose size={24} onClick={() => setIsShowAddCategory(false)} />
        </div>

        <div className='border-b w-full items-center justify-center pt-4 pb-4 flex'>
          <h5 className='text-xl font-bold tracking-tight'>Thêm loại sản phẩm</h5>
        </div>

        <div className='p-4'>
            <form className='font-semibold' onSubmit={handleSubmit(handleAdd)}>
                <InputFrom
                    label="Tên loại sản phẩm"
                    register={register}
                    errors={errors}
                    id='name'
                    validate={{ required: "Không được bỏ trống" }} 
                    fullWith
                    placeholder="Tên loại sản phẩm"
                />


          <div className='flex flex-col gap-2 mt-8'>
          <label className='font-semibold' htmlFor='thumb'>Hình ảnh</label>
          <input type='file' 
                  id="thumb"
                  {...register('thumb',{required:'Need fill'})}/>
                   {errors['thumb'] && <small className='text-xs text-main'>{errors['thumb']?.message}</small>}
                  
          </div>
          
          {preview.thumb && <div className='my-4'>
            <img src={preview.thumb} alt="thumb" className="w-[200px] object-contain"/>
            </div>}

                <div className='mt-8 justify-end flex  gap-4'> 
                
                    
                <Button style='px-4 py-2 rounded-md text-white text-semibold bg-gray-500 my-2' handleOnclick={()=>setIsShowAddCategory(false)}>Hủy</Button>


                    <Button  type="submit">Thêm</Button>
                
                </div>
            </form>
        </div>

        </div>

    </div>
  )
}

export default CreateProCategory