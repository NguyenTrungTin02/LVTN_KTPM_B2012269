import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdClose } from 'react-icons/io';
import InputFrom from './InputFrom';
import 'react-datepicker/dist/react-datepicker.css';
import {  apiAddDiscount } from '../apis';
import { toast } from 'react-toastify';


const EditDiscount = ({ editDiscount, setEditDiscount,render }) => {
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();
    

    
    useEffect(()=>{
        reset({
            discount: editDiscount?.discount || ''
        })
        const expirationDate = new Date(editDiscount?.expiration);
        const currentDate = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        let formattedDate
        const daysLeft = (Math.ceil((expirationDate - currentDate) / oneDay)+1);
        if(daysLeft>0){
            formattedDate = formatDate(editDiscount?.expiration);
        }
        else{formattedDate = currentDate}
        setStartDate(formattedDate)
        
    },[editDiscount])

    const handleEdit = async (data) => {
        const expiration = startDate
        const finalPayload = {...data,expiration}
        const response = await apiAddDiscount(editDiscount._id,finalPayload)
        if(response?.success) {
            toast.success(response?.mes)
            render()
            setEditDiscount(null)
        }else{
            toast.error(response?.mes)
        }
    };

    const [startDate, setStartDate] = useState(new Date());

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toString(); // Trả về chuỗi thời gian đã định dạng
    }

    


    return (
        <div className='flex justify-center items-center mt-[80px]'>
            <div className='bg-white w-[600px] max-h-[90vw] overflow-auto'>
                <div className='flex justify-end cursor-pointer'>
                    <IoMdClose size={24} onClick={() => setEditDiscount(null)} />
                </div>

                <div className='border-b w-full items-center justify-center pt-4 pb-4 flex'>
                    <h5 className='text-xl font-bold tracking-tight'>Chỉnh sửa giảm giá</h5>
                </div>

                <div className='p-4'>
                    <form className='font-semibold' onSubmit={handleSubmit(handleEdit)}>
                        <InputFrom
                            label="Mức giảm giá:"
                            register={register}
                            errors={errors}
                            id='discount'
                            validate={{ required: "Không được bỏ trống" }} 
                            fullWith
                            placeholder="10%, 15%, 20%,...."
                         
                        />

                        {/* Trường nhập ngày */}
                        <div className="mt-4">
                            <label className="block font-semibold mb-2">Ngày hết hạn:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                icon="fa fa-calendar"
                                dateFormat="dd/MM/yyyy"
                                />

                        </div>

                        {/* Nút chỉnh sửa */}
                       <div className='flex justify-end'>
                       <button type="submit" className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md justify-end">Chỉnh sửa</button>
                       </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDiscount;
