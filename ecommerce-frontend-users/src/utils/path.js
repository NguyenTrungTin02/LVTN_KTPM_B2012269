const path ={
    PUBLIC:'/',
    HOME:'',
    ALL:'*',
    LOGIN:'login',
    PRODUCT:':category',
    POST:'post',
    CONTACT:'contact',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE:':category/:pid/:title',
    FINAL_REGISTER:'finalregister/:status',
    RESET_PASSWORD:'reset-password/:token',
    EXPERIENCE:'experience',
    DETAIL_CART:'detail-cart',


    //admin
    ADMIN:'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER :'manage-user',
    MANAGE_ORDER :'manage-order',
    MANAGE_PRODUCTS :'manage-products',
    CREATE_PRODUCTS :'create-products',
    MANAGE_PRO_CATEGORY :'manage-pro-category',
    MANAGE_BRAND: 'manage-brand',
    MANAGE_DISCOUNT: 'manage-count',



    //customer

    CUSTOMER:'customer',
    PERSONAL: 'personal',
    CART:'cart',
    HISTORY_ORDER:'history-order',
    WISHLIST:'wishList',
    CHECK_OUT:'check_out'
}

export default path;