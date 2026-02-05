import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardChart = ({ risks }) => {
    // Count risks by level
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    risks.forEach(r => counts[r.level] = (counts[r.level] || 0) + 1);

    const data = {
        labels: ['Low', 'Medium', 'High', 'Critical'],
        datasets: [{
            label: 'Risk Count',
            data: [counts.Low, counts.Medium, counts.High, counts.Critical],
            backgroundColor: ['#4ade80', '#facc15', '#fb923c', '#f87171'],
        }]
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
             <h3 className="font-bold mb-4 text-center">Risk Distribution</h3>
             <Bar data={data} />
        </div>
    );
};

export default DashboardChart;