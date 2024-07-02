import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatMoney } from '../../utils/helpers'
import { Button, Congrat, InputFrom, Paypal } from '../../components'
import { useForm } from 'react-hook-form'
import { getCurrent } from '../../app/user/asyncActions'
import { useNavigate } from 'react-router-dom'
import path from '../../utils/path'
import { RadioGroup, RadioButton, ReversedRadioButton } from 'react-radio-buttons';
import { apiCreateOrder, apiCreateOrderCOD } from '../../apis'
import Swal from 'sweetalert2'

const CheckOut = () => {
    const {register,formState:{errors},watch,setValue,handleSubmit} = useForm()
    const address = watch('address')
    const name = watch('name')
    const mobile = watch('mobile')

    const [isSuccess, setIsSuccess] = useState(false)

    const {currentCart,current} = useSelector(state=>state.user)

    const dispatch=useDispatch()

    const navigate=useNavigate()
    useEffect(()=>{
        setValue('address',current?.address)
        setValue('name',current?.name)
        setValue('mobile',current?.mobile)
    },[current])

    useEffect(()=>{
        if(isSuccess) {
            dispatch(getCurrent())
            
        }
   
    },[isSuccess])


    const [paypalID, setPaypalID]= useState(false)
    const [cod, setCod]= useState(false)

    const onChange = (value) => {
       if(value ==='paypal') {
            setPaypalID(true)
            setCod(false)
        }
        if(value ==='cod') {
            setPaypalID(false)
            setCod(true)
        }
    }

    const handleAddOrder=async(data)=>{
        const response = await apiCreateOrderCOD({total:(currentCart?.reduce((sum,el)=>+el?.price* el?.quantity +sum,0 ))/23000,products:currentCart,...data,status:'cxn'})
        if(response.success){
            setIsSuccess(true)
            Swal.fire('Thành công','Đặt hàng thành công','success').then(()=>{navigate(`/${path.HISTORY_ORDER}`)})
        }

    }

  

  return (
    <div className='p-8 w-full gap-6'>

        {isSuccess && <Congrat/>}
  



        <div className='flex w-full flex-col gap-6 items-center justify-center'>
        <h2 className='text-3xl mb-6 font-bold'>Thanh toán đơn hàng</h2>

        
        <table className='table-auto w-[700px]'>
            <thead>
                <tr className='border bg-gray-200'>
                    <th className='text-left p-2'>Sản phẩm</th>
                    <th className='text-center p-2' >Số lượng</th>
                    <th className='text-right p-2'>Giá</th>
                </tr>
            </thead>
            <tbody>
                {currentCart?.map(el=>(
                    <tr className='border' key={el._id}>
                        <td className='text-left p-2'>{el?.title}</td>
                        <td className='text-center p-2'>{el?.quantity}</td>
                        <td className='text-right p-2'>{formatMoney(el?.price)+' VNĐ'}</td>
                    </tr>
                ))}
            </tbody>

            
        </table>
        <span className='flex items-center gap-8 text-lg'>
            <span>Tổng tiền: </span>
            <span className='font-bold'>{`${formatMoney(currentCart?.reduce((sum,el)=>+el?.price* el?.quantity +sum,0 ))} VNĐ`}</span>
        </span>
        
       <form onSubmit={handleSubmit(handleAddOrder)}>
       <InputFrom
                label='Tên khách hàng'
                register={register}
                errors={errors}
                id='name'
                validate={{required:'Need fill this field'}}
                placeholder='Nhập địa chỉ'
                style='w700'
                fullWith
                
        />
        <InputFrom
                label='Số điện thoại'
                register={register}
                errors={errors}
                id='mobile'
                validate={{required:'Need fill this field'}}
                placeholder='Nhập địa chỉ'
                style='w700'
                fullWith
        />
        <InputFrom
                label='Địa chỉ giao hàng'
                register={register}
                errors={errors}
                id='address'
                validate={{required:'Need fill this field'}}
                placeholder='Nhập địa chỉ'
                style='w700'
                fullWith
        />


            <div className='w-[700px] mt-2 justify-center'>
            <RadioGroup onChange={onChange} horizontal={true}>
                <RadioButton value="cod" style={{ border: 'none', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#000', fontSize: '14px', width: 'auto' }}>Thanh toán khi nhận hàng</span>
                </RadioButton>
                <RadioButton value="paypal" style={{ border: 'none', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#000', fontSize: '14px', width: 'auto' }}>Thanh toán bằng PayPal</span>
                </RadioButton>
            </RadioGroup>

            </div>

            
        { cod &&
            <div className='flex items-center justify-center mt-10'>
                <Button type='submit'>Đặt hàng</Button>
            </div>
        }
       </form>


        

       { paypalID && <div className='w-full'> 
            <Paypal 
            payload={{products:currentCart, 
                total:Math.round(currentCart?.reduce((sum,el)=>+el?.price* el?.quantity +sum,0 )/23000),
                oderBy: current?._id,
                address: address
            
            }}

            setIsSuccess={setIsSuccess}
            amount={Math.round(currentCart?.reduce((sum,el)=>+el?.price* el?.quantity +sum,0 )/23000)}/>
        </div>}

        </div>
    </div>
  )
}

export default CheckOut