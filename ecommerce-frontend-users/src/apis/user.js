import axios from "../axios";

export const apiRegister = (data) =>axios({
    url:'/user/register',
    method: 'post',
    data,
    withCredentials:true,
})


export const apiFinalRegister = (token) =>axios({
    url:'/user/finalregister/'+token,
    method: 'put',
})



export const apiLogin = (data) =>axios({
    url:'/user/login',
    method: 'post',
    data 
})



export const apiForgotPassword = (data) =>axios({
    url:'/user/forgot-password',
    method: 'post',
    data 
})


export const apiResetPassword = (data) =>axios({
    url:'/user/reset-password',
    method: 'put',
    data 
})

export const apiGetCurrent = () =>axios({
    url:'/user/current',
    method: 'get',
})


export const apiGetAllUser = (params) =>axios({
    url:'/user/getAllUser',
    method: 'get',
    params
})


export const apiUpdateCart=(data)=>axios({
    url:'/cart/cart',
    method: 'put',
    data
})

export const apiRemoveCart=(pid,color)=>axios({
    url:`/cart/remove-cart/${pid}/${color}`,
    method: 'delete',
    
})

export const apiUpdateUser = (data,id) =>axios({
    url:'/user/editUser/'+id,
    method: 'put',
    data
})

export const apiDeleteUser = (id) =>axios({
    url:'/user/'+id,
    method: 'delete',
  
})



export const apiUpdateAUser = (data) =>axios({
    url:'/user/editAUser',
    method: 'put',
    data
})

export const apiUpdateWishList = (pid) =>axios({
    url:'/user/wish-list/'+pid,
    method: 'put',
})


export const apiGetAllUserAdmin = (params) =>axios({
    url:'/user/getAllUserAdmin',
    method: 'get',
    params
})