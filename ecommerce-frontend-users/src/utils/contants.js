import path from "./path"
import { AiOutlineDashboard } from "react-icons/ai";
import { MdGroup } from "react-icons/md";

import { RiProductHuntLine } from "react-icons/ri";

import { BsTruck } from "react-icons/bs";
import { RiBillLine } from "react-icons/ri";
import { MdArrowBack } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";

export const navigation =[
    {
        id:1,
        value:'Trang chủ',
        path: `/${path.HOME}`
    },
    {
        id:2,
        value:'Sản phẩm',
        path: `/${path.PRODUCT}`
    },
    {
        id:3,
        value:'Về chúng tôi',
        path: `/${path.POST}`
    },
    {
        id:4,
        value:'Liên hệ',
        path: `/${path.CONTACT}`
    },
   
]



export const productExtraInformation = [
    {
        id: 1,
        title:'Guarantee',
        sub:'Quality Checked',
        icon: <BsTruck />
    },
    {
        id: 2,
        title:'Guarantee',
        sub:'Quality Checked',
        icon: <BsTruck />
    },
    {
        id: 3,
        title:'Guarantee',
        sub:'Quality Checked',
        icon: <BsTruck />
    },
    {
        id: 4,
        title:'Guarantee',
        sub:'Quality Checked',
        icon: <BsTruck />
    },

]

export const colors = [
    'Đen',
    'Nâu',
    'Xám',
    'Đỏ',
    'Xanh dương',
    'Hồng',
    'Cam',
    'Xanh lá',
    'Trắng'
]


export const sorts = [
    {
        id: 1,
        value: '',
        text: 'Chọn'
    },
    {
        id: 2,
        value: '-sold',
        text: 'Số sản phẩm đã bán'
    },
    {
        id: 3,
        value: 'title',
        text: 'Sắp theo tên, A-Z'
    },
    {
        id: 4,
        value: '-title',
        text: 'Sắp theo tên, Z-A'
    },
    {
        id: 5,
        value: '-totalDiscount',
        text: 'Giá từ cao đến thấp'
    },
    {
        id: 6,
        value: 'totalDiscount',
        text: 'Giá từ thấp đến cao'
    },
]



export const productInforTabs = [
    {
        id:1,
        name: 'THÔNG TIN SẢN PHẨM',
        content: `It's been a while since we met the last of the Mi kind. Even though the Xiaomi Mi 4 went on sale back in the summer of 2014, it succeeded in staying relevant for over 20 months and surpassed the lifespan of many competitors. Xiaomi surely took the time to make the Mi 5 worthy of the flagship series name.

        The Mi 5 was the first Xiaomi phone to be unveiled under the massive spotlight of the world's biggest mobile expo - the MWC in Barcelona. And with its stunning looks and capable performance, the Mi 5 deserved nothing less.
        
        The Xiaomi Mi 5 is instantly likeable - the new flagship comes with unbelievably thin bezels, a sharp profile, a curved back and a lightweight body - all adding to one of the most impressive exteriors a modern smartphones can hope for.
        
        Then you learn that inside there is the latest Snapdragon 820 chipset, a new 16MP camera with 4-axis optical stabilization and yet no camera hump, generous storage options, rich connectivity options, and a beefy battery. How about that?`
    },
    {
        id:2,
        name: 'THÔNG TIN BẢO HÀNH',
        content: `It's been a while since we met the last of the Mi kind. Even though the Xiaomi Mi 4 went on sale back in the summer of 2014, it succeeded in staying relevant for over 20 months and surpassed the lifespan of many competitors. Xiaomi surely took the time to make the Mi 5 worthy of the flagship series name.

        Barcelona. And with its stunning looks and capable performance, the Mi 5 deserved nothing less.
        
       curved back and a lightweight body - all adding to one of the most impressive exteriors a modern smartphones can hope for.
        
        Then you learn that inside there is the latest Snapdragon 820 chipset, a new 16MP camera with 4-axis optical stabilization and yet no camera hump, generous storage options, rich connectivity options, and a beefy battery. How about that?`
    },
    // {
    //     id:3,
    //     name: 'DELIVERY',
    //     content: `It's been a while since we met the last of the Mi kind. Even though the Xiaomi Mi 4 went on sale back in the summer of 2014, it succeeded in staying relevant for over 20 months and surpassed the lifespan of many competitors. Xiaomi surely took the time to make the Mi 5 worthy of the flagship series name.

    //     The Mi 5 was the first Xiaomi phone to be unveiled under the massive spotlight of the world's biggest mobile expo - the MWC in Barcelona. And with its stunning looks and capable performance, the Mi 5 deserved nothing less.
        
    //     The Xiaomi Mi 5 is instantly likeable - the new flagship comes with unbelievably thin bezels, a sharp profile, a curved back and a lightweight body - all adding to one of the most impressive exteriors a modern smartphones can hope for.
        
    //     Then you learn that inside there is the latest Snapdragon 820 chipset, a new 16MP camera with 4-axis optical stabilization and yet no camera hump, generous storage options, rich connectivity options, and a beefy battery. How about that?`
    // },
    // {
    //     id:4,
    //     name: 'PAYMENT'
    // },
   
]


export const voteOption = [
    {
        id: 1,
        text: 'Rất tệ'
    },
    {
        id: 2,
        text: 'Tệ'
    },
    {
        id: 3,
        text: 'Bình thường'
    },
    {
        id: 4,
        text: 'Tốt'
    },
    {
        id: 5,
        text: 'Rất tốt'
    },
]



export const sidebarAdmin  = [
    {
        id:1,
        type:'SINGLE',
        text:'Thống kê',
        path:`/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard />
    },
    {
        id:2,
        type:'SINGLE',
        text:'Quản lý người dùng',
        path:`/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroup />
    },
    {
        id:3,
        type:'PARENT',
        text:'Quản lý sản phẩm',
        icon: <RiProductHuntLine />,
        submenu :[
            {
                text: 'Thêm sản phẩm',
                path:`/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
            },
            {
                text: 'Quản lý sản phẩm',
                path:`/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
            },
            {
                text: 'Quản lý loại sản phẩm',
                path:`/${path.ADMIN}/${path.MANAGE_PRO_CATEGORY}`,
            },
            {
                text: 'Quản lý thương hiệu',
                path:`/${path.ADMIN}/${path.MANAGE_BRAND}`,
            },
            
        ]
    },
    {
        id:4,
        type:'SINGLE',
        text:'Quản lý giảm giá',
        path:`/${path.ADMIN}/${path.MANAGE_DISCOUNT}`,
        icon: <CiDiscount1 />
    },
    {
        id:5,
        type:'SINGLE',
        text:'Quản lý đặt hàng',
        path:`/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <RiBillLine />
    },
    {
        id:6,
        type:'SINGLE',
        text:'Trở lại',
        path:`/${path.HOME}`,
        icon: <MdArrowBack />

    },
]


export const sidebarCustomer  = [
    {
        id:1,
        type:'SINGLE',
        text:'Thông tin cá nhân',
        path:`/${path.CUSTOMER}/${path.PERSONAL}`,
        icon: <AiOutlineDashboard />
    },
    {
        id:2,
        type:'SINGLE',
        text:'Giỏ hàng',
        path:`/${path.CUSTOMER}/${path.CART}`,
        icon: <MdGroup />
    },
    {
        id:3,
        type:'SINGLE',
        text:'Lịch sử mua hàng',
        path:`/${path.CUSTOMER}/${path.HISTORY_ORDER}`,
        icon: <RiBillLine />
    },
    
    {
        id:4,
        type:'SINGLE',
        text:'Danh sách yêu thích',
        path:`/${path.CUSTOMER}/${path.WISHLIST}`,
        icon: <RiBillLine />
    },
]


export const role = [
    {
        code: 16,
        value: "Quản lý"
    },
    {
        code: 8,
        value: "Người dùng"
    }
]

export const block = [
    {
        code: false,
        value: "Đang hoạt động"
    },
    {
        code: true,
        value: "Đã chặn"
    }
]


export const statusOrder=[
    {
        label:'Đã hủy',
        value:'Canceld'
    },
    {
        label:'Đã thanh toán',
        value:'Succeed'
    },
    {
        label:'Chờ xác nhận',
        value:'cxn'
    },
    {
        label:'Đã xác nhận',
        value:'dxn'
    },
]




