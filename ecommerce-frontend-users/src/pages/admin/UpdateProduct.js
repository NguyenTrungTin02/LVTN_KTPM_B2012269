import React, { useCallback, useEffect, useState } from 'react';
import { Button, InputFrom, Loading, MarkdownEditor, Select } from '../../components';
import { getBase64, validate } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { apiGetBrand, apiUpdateProduct } from '../../apis';
import { IoCloseOutline } from "react-icons/io5";
import { useForm } from 'react-hook-form';
import ModelContainer from '../../components/ModelContainer';

const UpdateProduct = ({ editProduct, render, setEditProduct,setIsShowDescription }) => {
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();
  const [payload, setPayload] = useState({
    description: '',
    parameter: '',
    guarantee: ''
  });
  const { categories } = useSelector(state => state.app);
  const [invalidFields, setInvalidFields] = useState([]);
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
    model3d: null
  });
  const [hover, setHover] = useState(null);
  const [isFocusDescription, setIsFocusDescription] = useState(false);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false); // State để theo dõi trạng thái dữ liệu đã tải về hay chưa

  // Fetch brand data
  const fetchAllBrand = async () => {
    const response = await apiGetBrand();
    if (response.success) setBrand(response?.brand);
  };

  useEffect(() => {
    fetchAllBrand();
  }, []);

  useEffect(() => {
    if (categories && brand) {
      // Kiểm tra nếu cả categories và brand đã có dữ liệu
      setDataLoaded(true); // Đặt state là true khi dữ liệu đã tải xong
    }
  }, [categories, brand]);

  const changeValue = useCallback((e) => {
    setPayload(e);
  }, [payload]);

  useEffect(() => {
    reset({
      title: editProduct?.title || '',
      price: editProduct?.price || '',
      quantity: editProduct?.quantity || '',
      color: editProduct?.color || '',
      category: editProduct?.category || '',
      brand: editProduct?.brand || '',
    });
    setPayload({
      description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(', '): editProduct?.description,
      parameter: typeof editProduct?.parameter === 'object' ? editProduct?.parameter?.join(', '): editProduct?.parameter,
      guarantee: typeof editProduct?.guarantee === 'object' ? editProduct?.guarantee?.join(', '): editProduct?.guarantee
    });
    setPreview({
      thumb: editProduct?.thumb || '',
      images: editProduct?.images || [],
      model3d: editProduct?.model3d || '',
    });
  }, [editProduct]);

  const handlePreview3D = async (file) => {
    const base643D = await getBase64(file);
    setPreview(prev => ({ ...prev, model3d: base643D }));
  };

  useEffect(() => {
    if (watch('model3d') instanceof FileList && watch('thumb').length > 0) handlePreview3D(watch('model3d')[0]);
  }, [watch('model3d')]);

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview(prev => ({ ...prev, thumb: base64Thumb }));
  };

  useEffect(() => {
    if (watch('thumb') instanceof FileList && watch('thumb').length > 0) handlePreviewThumb(watch('thumb')[0]);
  }, [watch('thumb')]);

  const handlePreviewImages = async (files) => {
    const imagePreview = [];
    for (let file of files) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.warning("File không hợp lệ");
        return;
      }
      const base64 = await getBase64(file);
      imagePreview.push(base64);
    }
    setPreview(prev => ({ ...prev, images: imagePreview }));
  };

  useEffect(() => {
    if (watch('images') instanceof FileList && watch('images').length > 0) handlePreviewImages(watch('images'));
  }, [watch('images')]);

  const handleUpdateProduct = async (data) => {
    console.log(data)
    setLoading(true)
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category) {
        data.category = categories?.find(el => el.name === data.category)?.name;
      }
      if (data.brand) {
        data.brand = brand?.find(el => el.name === data.brand)?.name;
      }
      const finalPayload = { ...data, ...payload };
      finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0];
      finalPayload.model3d = data?.model3d?.length === 0 ? preview.model3d : data.model3d[0];
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      console.log(data.images.length)
      if (data.images && +data.images.length > 0) {
        for (let image of data.images) formData.append('images', image);
      } 
      // else {
      
      //   for (let image of preview.images) {
        
      //     formData.append('images', image);
      //   }
      // }
      const response = await apiUpdateProduct(formData, editProduct._id);
      setLoading(false)
      if (response.success) {
        toast.success(response.mes);
        render();
        setEditProduct(null);
        // setIsShowDescription(false)
      } else {
        toast.error(response.mes);
      }
    }
  };

  return (
    <div className='w-full flex flex-col gap-4 relative'>
      <div className='p-4 border-b w-full flex justify-between items-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Chỉnh sửa sản phẩm</h1>
        <span className='hover:underline cursor-pointer' onClick={() => setEditProduct(null)}>Quay lại</span>
      </div>


      {loading && <Loading/>}

      <div className='p-4'>
        {dataLoaded ? (
          <form onSubmit={handleSubmit(handleUpdateProduct)}>
            <InputFrom
              label="Tên sản phẩm"
              register={register}
              errors={errors}
              id='title'
              validate={{ require: "Need fill this field" }}
              fullWith
              placeholder="Tên sản phẩm"
            />

            <div className='w-full flex my-6 gap-4'>
              <InputFrom
                label="Giá"
                register={register}
                errors={errors}
                id='price'
                validate={{ require: "Need fill this field" }}
                style='flex-auto'
                placeholder="1000, 2000,...."
                type='number'
              />

              <InputFrom
                label="Số lượng"
                register={register}
                errors={errors}
                id='quantity'
                validate={{ require: "Need fill this field" }}
                style='flex-auto'
                placeholder="10,20,..."
                type='number'
              />

              <InputFrom
                label="Màu sắc"
                register={register}
                errors={errors}
                id='color'
                validate={{ require: "Need fill this field" }}
                style='flex-auto'
                placeholder="Màu sắc sản phẩm"
              />
            </div>

            <div className='w-full my-6 flex gap-4'>
              <Select
                label="Loại sản phẩm"
                options={categories?.map(el => ({ code: el.name, value: el.name }))}
                register={register}
                errors={errors}
                id='category'
                validate={{ require: true }}
                style='flex-auto'
              />

              <Select
                label="Thương hiệu"
                options={brand?.map(el => ({ code: el.name, value: el.name }))}
                register={register}
                errors={errors}
                id='brand'
                validate={{ require: true }}
                style='flex-auto'
              />
            </div>

            <MarkdownEditor
              name='description'
              changeValue={changeValue}
              label='Chi tiết sản phẩm'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.description}
              setIsFocusDescription={setIsFocusDescription}
            />

            <MarkdownEditor
              name='parameter'
              changeValue={changeValue}
              label='Thông số sản phẩm'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.parameter}
              setIsFocusDescription={setIsFocusDescription}
            />

            <MarkdownEditor
              name='guarantee'
              changeValue={changeValue}
              label='Chính sách bảo hành'
              invalidField={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.guarantee}
              setIsFocusDescription={setIsFocusDescription}
            />

            <div className='flex flex-col gap-2 mt-8'>
              <label className='font-semibold' htmlFor='thumb'>Hình ảnh sản phẩm</label>
              <input type='file' id="thumb" {...register('thumb')} />
              {errors['thumb'] && <small className='text-xs text-main'>{errors['thumb']?.message}</small>}
            </div>

            {preview.thumb && <div className='my-4'>
              <img src={preview.thumb} alt="thumb" className="w-[200px] object-contain" />
            </div>}

            <div className='flex flex-col gap-2 mt-8'>
              <label className='font-semibold' htmlFor='products'>Hình ảnh chi tiết</label>
              <input type='file' id="products" multiple {...register('images')} />
              {errors['products'] && <small className='text-xs text-main'>{errors['products']?.message}</small>}
            </div>

            {preview.images?.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
              {preview.images?.map((el, idex) => (
                <div className='w-fit relative' key={idex}>
                  <img src={el} alt="product" className="w-[200px] object-contain" />
                </div>
              ))}
            </div>}

            <div className='flex flex-col gap-2 mt-8'>
              <label className='font-semibold' htmlFor='model3d'>Mô hình 3D</label>
              <input type='file' id="model3d" {...register('model3d')} />
              {/* {errors['thumb'] && <small className='text-xs text-main'>{errors['thumb']?.message}</small>} */}
            </div>

            <div className='mt-8'> <Button type="submit">Chỉnh sửa sản phẩm</Button></div>

            {preview.model3d && (
        <div className='my-4'>
          <ModelContainer experience={preview?.model3d}/>
         
        </div>
      )}

           
          </form>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
