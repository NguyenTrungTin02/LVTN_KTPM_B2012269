import React from 'react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ghế', value: 400 },
  { name: 'Sofa', value: 300 },
  { name: 'Bàn', value: 300 },
  { name: 'Phụ kiện', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieComponents = () => {
  return (
    <div>
         <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className='grid grid-cols-4'>
                {
                    data.map((item,index)=>(
                        <p key={index} className='cursor-pointer font-bold'>{item.name}</p>
                    ))
                }
        </div>

        <div className='grid grid-cols-4 mt-[15px]'>
                {
                    COLORS.map((item,index)=>(
                        <div key={index} className='h-[30px] w-[30px]' style={{backgroundColor: item}}></div>
                    ))
                }
        </div>

    </div>
  )
}

export default PieComponents