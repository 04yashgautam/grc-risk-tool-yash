import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RiskForm from './components/RiskForm';
import Heatmap from './components/Heatmap';
import DashboardChart from './components/Dashboard';

function App() {
  const [risks, setRisks] = useState([]);

  const fetchRisks = async () => {
    const res = await axios.get('http://localhost:8000/risks'); // [cite: 67]
    setRisks(res.data);
  };

  useEffect(() => { fetchRisks(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">GRC Risk Dashboard</h1>
        
        <RiskForm onRiskAdded={fetchRisks} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           {/* Visualizations */}
           <Heatmap risks={risks} />
           <DashboardChart risks={risks} />
        </div>

        {/* Data Table [cite: 68, 69] */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Asset</th>
                <th className="p-3 text-left">Threat</th>
                <th className="p-3 text-left">Score</th>
                <th className="p-3 text-left">Level</th>
              </tr>
            </thead>
            <tbody>
              {risks.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="p-3">{r.asset}</td>
                  <td className="p-3">{r.threat}</td>
                  <td className="p-3">{r.score}</td>
                  <td className={`p-3 font-bold ${
                    r.level === 'Critical' ? 'text-red-600' : 
                    r.level === 'High' ? 'text-orange-500' : 'text-gray-800'
                  }`}>{r.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;