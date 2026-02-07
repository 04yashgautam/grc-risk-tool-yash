import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import RiskForm from './components/forms/RiskForm';
import Heatmap from './components/dashboard/Heatmap';
import StatsCards from './components/dashboard/StatsCards';
import RiskPieChart from './components/charts/RiskPieChart';
import RiskLineChart from './components/charts/RiskLineChart';

function App() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filterLevel, setFilterLevel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });

  // fetch 
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const fetchRisks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/risks`);
      setRisks(res.data);
    } catch (error) {
      console.error("Error fetching risks:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);


  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  // filter
  const filteredRisks = risks.filter(r => {
    const matchesLevel = filterLevel === 'All' || r.level === filterLevel;
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      r.asset.toLowerCase().includes(lowerSearch) ||
      r.threat.toLowerCase().includes(lowerSearch);
    return matchesLevel && matchesSearch;
  });

  // sorting
  const sortedRisks = [...filteredRisks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // sort handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // csv handler
  const handleDownloadCSV = () => {
    const headers = ["ID", "Asset", "Threat", "Score", "Level", "Mitigation", "Created At"];
    const csvRows = [
      headers.join(','),
      ...sortedRisks.map(row => {
        return [
          row.id,
          `"${(row.asset || '').replace(/"/g, '""')}"`,
          `"${(row.threat || '').replace(/"/g, '""')}"`,
          row.score,
          row.level,
          `"${(row.mitigation || '').replace(/"/g, '""')}"`,
          `"${(row.created_at || '').replace(/"/g, '""')}"`
        ].join(',');
      })
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `risk_registry_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // check loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center z-50">
        <div className="relative flex items-center justify-center">

          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>

          <div className="absolute">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-gray-400 font-mono animate-pulse tracking-widest text-sm">LOADING RISKS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden">

      {/* Header */}
      <header className="bg-zinc-950 border-b border-white/10 sticky top-0 z-40 shadow-lg">
        <div className="w-full px-4 md:px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <h1 className="text-lg md:text-xl font-bold tracking-tight truncate">Xiarch GRC Dashboard</h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-gray-200 text-black px-3 py-1.5 md:px-4 md:py-2 rounded font-semibold text-xs md:text-sm transition-all border border-white/20 shrink-0 ml-3 shadow-md"
          >
            <span className="md:hidden">+ Add</span>
            <span className="hidden md:inline">+ Assess Risk</span>
          </button>

        </div>
      </header>


      <main className="w-full px-6 py-8 space-y-6">

        <StatsCards risks={risks} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[450px]">
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-zinc-950 p-6 rounded-lg border border-white/10"> <RiskLineChart risks={risks} /> </div>
          </div>
          <div className="h-full"> <Heatmap risks={sortedRisks} /> </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[350px]">
          <div className="h-full"> <RiskPieChart risks={sortedRisks} /> </div>
          <div className="h-full bg-zinc-950/30 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-white/20 hover:bg-zinc-950/50">
            <span className="text-4xl mb-2 opacity-30">+</span>
            <span className="text-sm font-medium uppercase tracking-widest opacity-50">Future Component Slot</span>
          </div>
        </div>

        <div className="bg-zinc-950 shadow-xl rounded-lg border border-white/10 flex flex-col h-[600px]">

          <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 bg-zinc-950 rounded-t-lg z-20">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Risk Table</h3>

            <div className="flex items-center gap-3 bg-zinc-900/50 p-1 rounded-lg border border-white/10">

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black text-white text-sm rounded pl-8 pr-3 py-1.5 focus:outline-none border border-transparent focus:border-blue-500 w-32 focus:w-48 transition-all placeholder-gray-600"
                />
              </div>

              <div className="h-4 w-px bg-white/20 mx-1"></div>

              <button onClick={handleDownloadCSV} className="text-gray-400 hover:text-white px-2 transition-colors" title="Export CSV">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>

              <div className="h-4 w-px bg-white/20 mx-1"></div>

              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="bg-black text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none hover:text-white cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="overflow-auto flex-1 w-full custom-scrollbar">
            <table className="min-w-full text-left relative border-collapse">
              <thead className="bg-zinc-900 border-b border-white/10 sticky top-0 z-10 shadow-lg">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-zinc-900">Asset</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-zinc-900">Threat</th>
                  <th className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:text-gray-300 select-none bg-zinc-900" onClick={() => handleSort('score')}>
                    Score {sortConfig.key === 'score' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-zinc-900">Level</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-zinc-900">Mitigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedRisks.length > 0 ? sortedRisks.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{r.asset}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.threat}</td>
                    <td className="px-6 py-4 text-sm font-mono text-white font-bold">{r.score}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded border ${r.level === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                          r.level === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                            r.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                              'bg-green-500/10 text-green-400 border-green-500/30'
                        }`}>{r.level}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{r.mitigation}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <p>No risks found matching "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-zinc-950 rounded-lg shadow-2xl max-w-2xl w-full border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Assess New Risk</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6"> <RiskForm onRiskAdded={() => { fetchRisks(); setIsModalOpen(false); }} /> </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;