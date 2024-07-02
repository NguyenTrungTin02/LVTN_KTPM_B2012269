import React, { useCallback, useEffect, useState } from 'react';
import { EditDiscount, InputFrom, Pagination } from '../../components';
import { useForm } from 'react-hook-form';
import { apiGetProduct } from '../../apis';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { formatMoney } from '../../utils/helpers';
import moment from 'moment';
import { LiaEditSolid } from "react-icons/lia";

const ManagerDiscount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, formState: { errors }, handleSubmit, reset, watch } = useForm();
    const [products, setProducts] = useState(null);
    const [count, setCount] = useState(0);
    const [update, setUpdate] = useState(false);
    const [params] = useSearchParams();
    const [editDiscount, setEditDiscount] = useState(null)

    const calculatorDate = (date)=>{
        const expirationDate = new Date(date);
        const currentDate = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    
        const daysLeft = (Math.ceil((expirationDate - currentDate) / oneDay)+1);

        return daysLeft
    }

    const fetchProducts = async (params) => {
        const response = await apiGetProduct({ ...params, limit: process.env.REACT_APP_LIMIT });
        if (response.success) {
            setProducts(response.products);
            setCount(response.counts);
        }
    };

    const handleSearchProducts = (data) => {};

    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    useEffect(() => {
        render();
    }, [setEditDiscount]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchProducts(searchParams);
    }, [params, update]);

    const queryDecounce = useDebounce(watch('q'), 800);

    useEffect(() => {
        if (queryDecounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDecounce }).toString()
            });
        } else {
            navigate({
                pathname: location.pathname,
            });
        }
    }, [queryDecounce]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchProducts(searchParams);
    }, [params, update]);

    return (
        <div className='w-full flex flex-col gap-4 relative pr-4'>

            <div className='px-4 border-b w-full items-center justify-between pt-4'>
                <h1 className='text-3xl font-bold tracking-tight'>Quản lý sản phẩm</h1>
            </div>

            {editDiscount && (
           <div className='fixed inset-0 z-50 flex justify-center items-center'>
           <div className='bg-overplay w-full h-full'>

            <EditDiscount editDiscount={editDiscount}  
          
                render={render}
                  setEditDiscount={setEditDiscount}
                  
                  />
          </div>
        </div>
      )}
            <div className='flex w-full justify-end items-center px-8'>
                <form className='w-[50%]' onSubmit={handleSubmit(handleSearchProducts)}>
                    <InputFrom
                        id='q'
                        register={register}
                        errors={errors}
                        fullWith
                        placeholder='Tìm kiếm sản phẩm.....'
                    />
                </form>
            </div>
            <table className='table-auto'>
                <thead>
                    <tr className='bg-sky-700 text-white border-white'>
                        <th className='text-center'>STT</th>
                        <th className='text-center'>Hình ảnh</th>
                        <th className='text-center'>Tên sản phẩm</th>
                        <th className='text-center'>Màu sắc</th>
                        <th className='text-center'>Giá</th>
                        <th className='text-center'>Mức giảm giá</th>
                        <th className='text-center'>Giá sau giảm giá</th>
                        <th className='text-center'>Thời hạn giảm giá</th>
                        <th className='text-center'>Tình trạng</th>
                        <th className='text-center'>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product, index) => (
                        <React.Fragment key={product._id}>
                            <tr >
                                <td className='text-center'>{((+params.get('page') - 1 > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + 1 + index}</td>
                                <td className='text-center'>
                                    <img src={product.thumb} alt='thumb' className='w-12 h-12 object-cover ' />
                                </td>
                                <td className='text-center'>{product?.title}</td>
                                <td className='text-center'>{product?.color}</td>
                                <td className='text-center'>{formatMoney(product?.price)} VNĐ</td>
                                <td className='text-center'>{product?.discount}%</td>
                                <td className='text-center'>{formatMoney(product?.totalDiscount)} VNĐ</td>
                                <td className='text-center'>
                                   {calculatorDate(product?.expiration) > 0 ? <span>{moment(product?.expiration).format("DD/MM/YYYY")}</span> : <span>--/--/----</span>}
                                </td>
                                <td className='text-center'>
                                    {calculatorDate(product?.expiration) > 0 ? <span className='border rounded-md px-2 py-1 bg-red-500 text-white'>Giảm giá còn {calculatorDate(product?.expiration)} ngày</span> : <span className='border rounded-md px-2 py-1 bg-gray-500 text-white'>Không giảm giá</span>}
                                </td>
                                <td className='text-center'>
                                    <span 
                                    onClick={()=>setEditDiscount(product)}
                                    className='hover:underline cursor-pointer px-1 inline-block' title='Chỉnh sửa sản phẩm' ><LiaEditSolid /></span>
                                </td>
                            </tr>
                            {product.varriants.map((variant, variantIndex) => (
                                <tr key={variant._id} >
                                    <td className='text-center'>-</td>
                                    <td className='text-center'>
                                        <img src={variant?.thumb} alt='thumb' className='w-12 h-12 object-cover ' />
                                    </td>
                                    <td className='text-center'>{variant?.title}</td>
                                    <td className='text-center'>{variant?.color}</td>
                                    <td className='text-center'>{formatMoney(variant?.price)} VNĐ</td>
                                    <td className='text-center'>{variant?.discount}%</td>
                                    <td className='text-center'>{formatMoney(variant?.totalDiscount)} VNĐ</td>
                                    <td className='text-center'>
                                        {calculatorDate(variant?.expiration) >0 ? <span>{moment(variant?.expiration).format("DD/MM/YYYY")}</span> : <span>--/--/----</span>}
                                    </td>
                                    <td className='text-center'>
                                        {calculatorDate(variant?.expiration) > 0 ? <span className='border rounded-md px-2 py-1 bg-red-500 text-white'>Giảm giá còn {calculatorDate(variant?.expiration)} ngày</span> : <span className='border rounded-md px-2 py-1 bg-gray-500 text-white'>Không giảm giá</span>}
                                    </td>
                                    <td className='text-center'>
                                        <span 
                                        onClick={()=>setEditDiscount(variant)}
                                        
                                        className='hover:underline cursor-pointer px-1 inline-block' title='Chỉnh sửa' ><LiaEditSolid /></span>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div className='w-full flex justify-end my-8'>
                <Pagination totalCount={count} />
            </div>
        </div>
    );
};

export default ManagerDiscount;
