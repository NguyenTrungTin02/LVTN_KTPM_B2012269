import React from 'react'
import Masonry from 'react-masonry-css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1
};

const HomeCategory = () => {
    const { categories } = useSelector(state => state.app);

    return (
        <div>
         <div className='px-4 w-full items-center justify-center pt-4 mt-[80px] relative'>
                <h1 className='text-[25px] font-bold text-center relative'>
                    DANH MỤC SẢN PHẨM
                    <span className="absolute bottom-0 left-0 bg-black" style={{ width: 'fit-content' }}></span>
                </h1>
            </div>



            <div className='mt-8 w-main m-auto '>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex mx-[-10px]"
                    columnClassName="my-masonry-grid_column">
                    {categories?.map(el => (
                        <NavLink key={el._id} 
                        
                        to={el.name}
                        className="masonry-item">
                             <div className='flex justify-center items-center flex-col'>
                             <img src={el.thumb} alt={el.name} className=" w-[200px] h-[200px] object-cover mb-2" />
                            <div className="text-center font-bold">{el.name}</div>
                             </div>
                        </NavLink>
                    ))}
                </Masonry>
            </div>
        </div>
    );
}

export default HomeCategory;
