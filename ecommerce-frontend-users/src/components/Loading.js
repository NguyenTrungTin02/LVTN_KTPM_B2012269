import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Loading = () => {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-overplay bg-opacity-75 z-50'>
      <RotatingLines
        visible={true}
        height={96}
        width={96}
        color="gray"
        strokeWidth={5}
        animationDuration={0.75}
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default Loading;
