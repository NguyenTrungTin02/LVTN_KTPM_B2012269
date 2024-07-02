import axios from "../axios";

export const apiGetCategories = () => axios({
    url: 'product-category/get-all-product-category/',
    method: 'get',
})

