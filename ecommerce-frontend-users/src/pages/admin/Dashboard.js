import React, { useEffect, useState } from 'react';
import { formatMoney } from '../../utils/helpers';
import { FaRegCalendarAlt } from "react-icons/fa";
import { CartesianGrid, Legend, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from 'recharts';
import { RiProductHuntLine } from "react-icons/ri";
import { RiBillLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { apiGetAllUserAdmin, apiGetOrderAdmin } from '../../apis';

const Dashboard = () => {
  const [order, setOrder] = useState(null);
  const [totalProductsSold, setTotalProductsSold] = useState(0); 
  const [count, setCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [totalUser, setTotalUser] = useState(0);

  function getCurrentMonth() {
    const currentDate = new Date();
    return String(currentDate.getMonth() + 1);
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  useEffect(() => {
    fetchOrder();
    fetchUsers();
    const fetchChartData = async () => {
      const data = await calculateChartData();
      setChartData(data);
    };
    fetchChartData();
  }, [selectedMonth, selectedYear]);

  const fetchOrder = async(params) => {
    const response = await apiGetOrderAdmin({
      ...params,
      month: selectedMonth,
      year: selectedYear,
      limit: 100000,
    });
    
    if(response.success) {
      setOrder(response?.orders);
      const totalProductsCount = countTotalProducts(response?.orders);
      setTotalProductsSold(totalProductsCount);
      setCount(response?.counts);
      const totalRev = calculateTotalRevenue(response?.orders);
      setTotalRevenue(totalRev);
    }
  };


  const fetchUsers = async(params) => {
    const response = await apiGetAllUserAdmin({
      ...params,
      month: selectedMonth,
      year: selectedYear,
      limit: 100000,
    });
    
    if(response.success) {
      setTotalUser(response?.counts)
    }

  };


  const countTotalProducts = (orders) => {
    let totalProducts = 0;
    orders.forEach(order => {
      if(order?.status === "Succeed"){
        order.products.forEach(product => {
          totalProducts += product.quantity;
        });
      }
    
    });
    return totalProducts;
  };

  const calculateTotalRevenue = (orders) => {
    let totalRevenue = 0;
    orders.forEach(order => {
      if(order?.status === "Succeed")
        totalRevenue += order.total;
    });
    return totalRevenue * 23500;
  };

 

  const calculateChartData = async () => {
    const chartData = [];
    let selectedMonthIndex = parseInt(selectedMonth);
    let selectedYearValue = selectedYear;
  
    for (let i = 0; i < 6; i++) {
      const monthData = {
        name: `${selectedMonthIndex.toString().padStart(2, '0')}/${selectedYearValue}`,
        uv: 0,
      };
  
      const response = await apiGetOrderAdmin({
        month: selectedMonthIndex,
        year: selectedYearValue,
        limit: 100000,
      });
  
      if (response.success) {
        response?.orders.forEach(order => {
          if(order?.status === "Succeed")
            monthData.uv += order.total;
        });
  
        // Convert revenue to VND by multiplying by 23500
        monthData.uv *= 23500;
  
        chartData.unshift(monthData);
      }
  
      // Decrease month and adjust year if necessary
      selectedMonthIndex--;
      if (selectedMonthIndex === 0) {
        selectedMonthIndex = 12;
        selectedYearValue--;
      }
    }
    return chartData;
  };
  

  return (
    <div className='w-full h-screen'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Thống kê</span>
      </h1>

      <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px]  border-[#EDEDED]'>
        <h2 className='font-semibold'>Tổng quan về cửa hàng trong (Tháng {selectedMonth} - Năm {selectedYear}):</h2>
        <div className=' flex gap-2'> 
          <select className="border rounded-md px-7 py-1" value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>Tháng {month}</option>
            ))}
          </select>
          <select className="border rounded-md px-7 py-1" value={selectedYear} onChange={handleYearChange}>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>Năm {year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-[30px] mt-[10px] pb-[25px] mr-[10px]'>
        <div className='h-[100px] rounded-[8px] bg-gray-200 border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out '>
          <div>
            <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold'>Sản phẩm bán ra</h2>
            <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{totalProductsSold} sản phẩm</h1>
          </div>
          <RiProductHuntLine size={24} />
        </div>

        <div className='h-[100px] rounded-[8px] bg-gray-200 border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out '>
          <div>
            <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold'>Tổng số đơn hàng</h2>
            <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{count} đơn hàng</h1>
          </div>
          <RiBillLine size={24} />
        </div>

        <div className='h-[100px] rounded-[8px] bg-gray-200 border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out '>
          <div>
            <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold'>Doanh thu</h2>
            <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatMoney(totalRevenue)} VNĐ</h1>
          </div>
          <FaRegCalendarAlt size={24} />
        </div>

        <div className='h-[100px] rounded-[8px] bg-gray-200 border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out '>
          <div>
            <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold'>Người dùng mới</h2>
            <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{totalUser}</h1>
          </div>
          <FaRegUser size={24} />
        </div>
      </div>

      <div className='flex mt-[10px] w-full gap-[8px]'>
        <div className='w-[99%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
          <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
            <h2 className='font-semibold'>Tổng quan về doanh thu trong 6 tháng vừa qua: </h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
          <LineChart
              width={900}
              height={400}
              data={chartData}
              margin={{ top: 30, right: 40, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `${formatMoney(value)}`}
              />
              <Tooltip
                formatter={(value) => formatMoney(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
