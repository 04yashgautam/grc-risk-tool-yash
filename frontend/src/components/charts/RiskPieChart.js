import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskPieChart = ({ risks }) => {
  const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  risks.forEach(r => { if (counts[r.level] !== undefined) counts[r.level] += 1; });

  const data = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [counts.Critical, counts.High, counts.Medium, counts.Low],
      backgroundColor: [
        'rgba(239, 68, 68, 0.9)',   // for red
        'rgba(249, 115, 22, 0.9)',  // for orange
        'rgba(234, 179, 8, 0.9)',   // for yellow 
        'rgba(34, 197, 94, 0.9)'    // for green
      ],
      borderColor: '#000',
      borderWidth: 2,
      hoverBorderColor: '#fff',
      hoverBorderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    layout: { 
      padding: 0
    },
    plugins: {
      legend: { 
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '75%', 
  };

  const legendItems = [
    { label: 'Critical', value: counts.Critical, color: 'bg-red-500' },
    { label: 'High', value: counts.High, color: 'bg-orange-500' },
    { label: 'Medium', value: counts.Medium, color: 'bg-yellow-500' },
    { label: 'Low', value: counts.Low, color: 'bg-green-500' },
  ];

  return (
    <div className="bg-zinc-950 p-4 rounded-lg border border-white/10 h-full flex flex-col justify-between">
      <h3 className="font-bold text-white text-sm uppercase tracking-wider text-center mb-2">Severity Distribution</h3>
      <div className="flex-1 min-h-0 flex items-center justify-center py-2">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <span className="text-4xl font-bold text-white font-mono leading-none tracking-tighter">
              {risks.length}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">
              Total
            </span>
          </div>
          <Doughnut data={data} options={options} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
            <span className="text-xs font-medium text-gray-300">
              {item.label}: <span className="text-white ml-0.5">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskPieChart;