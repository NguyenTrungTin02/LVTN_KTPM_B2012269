import React, { useEffect, useState } from 'react';
import {Routes, Route} from 'react-router-dom'
import path from './utils/path'
import { Contact, DetailCart, DetailProduct, Experience, FinalRegister, Home, Login, Post, Products, Public, ResetPassword } from './pages/public';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCategories } from './app/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import {CartProduct, Modal} from './components'
import {AdminLayout, CreateProduct, Dashboard, ManagerBrand, ManagerDiscount, ManagerOrder, ManagerProCategory, ManagerProducts, ManagerUser} from './pages/admin'
import {Cart, CheckOut,  HistoryOrder, Personal, WishList} from './pages/customer'
import { showCart } from './app/appSlice';

function App() {

  const dispatch = useDispatch()
  const {isShowModal, modalChildren,isShowCart} = useSelector(state=>state.app)

  useEffect(()=>{
     dispatch(getCategories())
  },[])

  

 
   





  return (
    <div className="font-main relative">
      {
        isShowCart && <div onClick={()=>dispatch(showCart())} className='absolute inset-0 z-50 bg-overplay flex justify-end'>
        <CartProduct/>
      </div>
      }

   



      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public/>}>
          <Route path={path.HOME} element={<Home/>}/>
          <Route path={path.PRODUCT} element={<Products/>}/>
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct/>}/>
          <Route path={path.POST} element={<Post/>}/>
          <Route path={path.RESET_PASSWORD} element={<ResetPassword/>}/>
          <Route path={path.ALL} element={<Home/>}/>
          <Route path={path.DETAIL_CART} element={<DetailCart/>}/>
          <Route path={path.PERSONAL} element={<Personal/>}/>
          <Route path={path.CART} element={<Cart/>}/>
          <Route path={path.HISTORY_ORDER} element={<HistoryOrder/>}/>
          <Route path={path.WISHLIST} element={<WishList/>}/>
          <Route path={path.CONTACT} element={<Contact/>}/>
        </Route>

        <Route path={path.ADMIN} element={<AdminLayout/>}>
          <Route path={path.DASHBOARD} element={<Dashboard/>}/>
          <Route path={path.MANAGE_ORDER} element={<ManagerOrder/>}/>
          <Route path={path.MANAGE_PRODUCTS} element={<ManagerProducts/>}/>
          <Route path={path.MANAGE_USER} element={<ManagerUser/>}/>
          <Route path={path.CREATE_PRODUCTS} element={<CreateProduct/>}/>
          <Route path={path.MANAGE_PRO_CATEGORY} element={<ManagerProCategory/>}/>
          <Route path={path.MANAGE_BRAND} element={<ManagerBrand/>}/>
          <Route path={path.MANAGE_DISCOUNT} element={<ManagerDiscount/>}/>
        </Route>

      
          
          

          
          
      
        

        <Route path={path.CHECK_OUT} element={<CheckOut/>}/>

        <Route path={path.LOGIN} element={<Login/>}/>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister/>}/>
        {/* <Route path={path.EXPERIENCE} element={<Experience/>}/> */}
        

      </Routes>

      <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"

    />
    </div>
  );
}

export default App;
