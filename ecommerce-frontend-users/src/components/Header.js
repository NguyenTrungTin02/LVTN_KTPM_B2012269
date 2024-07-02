// Header.js
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, logout } from '../app/user/userSlice';
import { showCart } from '../app/appSlice';
import { navigation } from '../utils/contants';
import path from '../utils/path';
import withBaseComponent from '../hocs/withBaseComponent';
import avatar from '../assets/avatar.jpg';
import { getCurrent } from '../app/user/asyncActions';
import Swal from 'sweetalert2';

const Header = ({ dispatch }) => {
  const [isShowOption, setShowOption] = useState(false);
  const { categories } = useSelector(state => state.app);
  const navigate = useNavigate();
  const { isLoggedIn, current, mes } = useSelector(state => state.user);

  useEffect(() => {
    const handleClickOptions = (e) => {
      const profile = document.getElementById('profile');
      if (!profile?.contains(e.target)) setShowOption(false);
    };

    document.addEventListener('click', handleClickOptions);

    return () => {
      document.removeEventListener('click', handleClickOptions);
    };
  }, []);

  useEffect(() => {
    const setTimeOut = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 200);

    return () => {
      clearTimeout(setTimeOut);
    };

  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (mes) {
      Swal.fire('Thất bại', mes, 'info').then(() => {
        dispatch(clearMessage());
        navigate(`/${path.LOGIN}`);
      });
    }
  }, [mes]);

  return (
    <div className="w-main" >
      <div className="md:px-10 py-5 px-1 md:flex justify-between items-center bg-gray-100">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-4xl font-bold text-main-dark hover:text-main">
            Home<span className="text-decor text-main">Decor</span>Hub
          </Link>
        </div>
        <div className="pl-9 md:pl-0 md:flex items-center">
          <div className="flex gap-12">
            {navigation.map(el => (
              <NavLink
                to={el.path}
                key={el.id}
                className={({ isActive }) => isActive ? 'hover:text-main text-main font-semibold my-7 md:my-0' : 'hover:text-main font-semibold my-7 md:my-0'}>
                {el.value}
              </NavLink>
            ))}
          </div>
          <div className="ml-10 flex items-center gap-4 relative">
            {isLoggedIn && current && (
              <Fragment>
                <div onClick={() => dispatch(showCart())} className="flex items-center gap-2 cursor-pointer">
                  <FaCartShopping color="red" />
                  <span>{`${current?.cart?.length || 0} sản phẩm`}</span>
                </div>
                <div className="cursor-pointer flex items-center" id="profile" onClick={() => setShowOption(!isShowOption)}>
                  <img src={current?.avatar || avatar} alt="avatar" className="w-10 h-10 object-cover rounded-full" />
                  <div className="flex flex-col ml-2">
                    <span className="text-sm">Xin chào, <span className="font-semibold">{current?.name}</span></span>
                  </div>
                  {isShowOption && (
                    <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 z-50">
                      <Link className="block px-4 py-2 hover:bg-blue-100" to={`/${path.PERSONAL}`}>Thông tin cá nhân</Link>
                      <Link className="block px-4 py-2 hover:bg-blue-100" to={`/${path.WISHLIST}`}>Yêu thích</Link>
                      <Link className="block px-4 py-2 hover:bg-blue-100" to={`/${path.HISTORY_ORDER}`}>Lịch sử mua hàng</Link>
                      {+current?.role === 16 && <Link className="block px-4 py-2 hover:bg-blue-100" to={`/${path.ADMIN}/${path.DASHBOARD}`}>Quản lý cửa hàng</Link>}
                      <span onClick={() => dispatch(logout())} className="block px-4 py-2 hover:bg-blue-100">Đăng xuất</span>
                    </div>
                  )}
                </div>
              </Fragment>
            )}
            {!isLoggedIn && (
              <Link to={`/${path.LOGIN}`} className="font-semibold hover:text-main py-2 px-4 rounded-md border border-main">Đăng nhập và Đăng ký</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(Header);
