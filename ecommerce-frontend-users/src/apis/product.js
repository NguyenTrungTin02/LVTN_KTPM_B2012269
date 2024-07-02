import axios from "../axios";

export const apiGetProduct = (params) =>axios({
    url:'/product/get-all-product',
    method: 'get',
    params 
})

export const apiAGetProduct = (pid) =>axios({
    url:'/product/get-a-product/'+pid,
    method: 'get',
})

export const apiRating = (data) =>axios({
    url:'/product/rating',
    method: 'put',
    data
})

export const apiCreateProduct = (data) =>axios({
    url:'/product/',
    method: 'post',
    data
})

export const apiUpdateProduct = (data,id) =>axios({
    url:'/product/update-product/'+id,
    method: 'put',
    data
})

export const apiDeleteProduct = (id) =>axios({
    url:'/product/delete-product/'+id,
    method: 'delete',

})


export const apiAddVarriantProduct = (data,id) =>axios({
    url:'/product/varriant/'+id,
    method: 'put',
    data
})


export const apiCreateOrder = (data) =>axios({
    url:'/order/create-order',
    method: 'post',
    data
})

export const apiCreateOrderCOD = (data) =>axios({
    url:'/order/create-order-cod',
    method: 'post',
    data
})

export const apiGetOrders = (params) =>axios({
    url:'/order/get-order',
    method: 'get',
    params
})

export const apiGetOrderAdmin = (params) =>axios({
    url:'/order/get-order/admin',
    method: 'get',
    params
})


export const apiUpdateCategory = (data, id) =>axios({
    url:'/product-category/update-product-category/'+id,
    method: 'put',
    data
})


export const apiDeleteCategory = (id) =>axios({
    url:'/product-category/delete-product-category/'+id,
    method: 'delete'
})


export const apiAddCategory = (data) =>axios({
    url:'/product-category/create-product-category/',
    method: 'post',
    data
})

export const apiGetBrand = (params) =>axios({
    url:'/brand/get-all-brand',
    method: 'get',
    params
})

export const apiAddBrand = (data) =>axios({
    url:'/brand/create-brand/',
    method: 'post',
    data
})

export const apiUpdateBrand = (data, id) =>axios({
    url:'/brand/update-brand/'+id,
    method: 'put',
    data
})



export const apiDeleteBrand = (id) =>axios({
    url:'/brand/delete-brand/'+id,
    method: 'delete'
})

export const apiAddDiscount = (id,data) =>axios({
    url:'/product/add-discount/'+id,
    method: 'put',
    data
})

export const apiChangeOrder = (id, data) => axios({
    url: '/order/change-order/' + id,
    method: 'put',
    data // Pass the status data here
});


export const apiDeleteRating = (productId, ratingId) => axios({
    url: '/product/products/'+productId+'/ratings/'+ratingId,
    method: 'delete',
 
});
