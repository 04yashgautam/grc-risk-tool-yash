import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RiskLineChart = ({ risks = [] }) => {
  
  if (!risks) {
    return <div className="text-gray-500 text-sm p-4">Loading chart data...</div>;
  }

  // last 7 days data
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  // mapping risks-date
  const dataPoints = last7Days.map(dateStr => {
    return risks.filter(r => 
      r.created_at && r.created_at.startsWith(dateStr)
    ).length;
  });

  // chart data config
  const data = {
    labels: last7Days.map(d => d.slice(5)),
    datasets: [{
      label: 'New Risks',
      data: dataPoints,
      borderColor: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#000',
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBorderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false }, 
      title: { 
        display: true, 
        text: 'RISK TREND (Last 7 Days)', 
        color: '#fff', 
        font: { size: 14, weight: 'bold' },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      }
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' }, 
        ticks: { stepSize: 1, color: '#9ca3af' },
        border: { display: false }
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: '#9ca3af' },
        border: { display: false }
      }
    }
  };

  return (
    <div className="bg-zinc-950 p-6 rounded-lg border border-white/10 flex flex-col justify-center">
       <div className="relative w-full h-64 md:h-80">
         <Line options={options} data={data} />
       </div>
    </div>
  );
};

export default RiskLineChart;