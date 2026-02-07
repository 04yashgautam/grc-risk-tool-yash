import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RiskForm = ({ onRiskAdded }) => {
  const [formData, setFormData] = useState({ asset: '', threat: '', likelihood: 3, impact: 3 });
  const [preview, setPreview] = useState({ score: 9, level: 'Medium' });

  // update preview
  useEffect(() => {
    const score = formData.likelihood * formData.impact;
    let level = 'Low';
    if (score > 5) level = 'Medium';
    if (score > 12) level = 'High';
    if (score > 18) level = 'Critical';
    setPreview({ score, level });
  }, [formData.likelihood, formData.impact]);

  // handlesubmit /assess-risk
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the variable here
      await axios.post(`${API_BASE_URL}/assess-risk`, formData);
      onRiskAdded();
    } catch (err) { 
      alert('Error adding risk'); 
    }
  };


  return (

    // assess form
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      
      <div>
        <label className="block text-xs font-bold uppercase mb-2 text-gray-400">Asset Name</label>
        <input 
          className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white placeholder-gray-600 focus:border-white/40 focus:outline-none transition-colors" 
          value={formData.asset}
          onChange={e => setFormData({...formData, asset: e.target.value})}
          placeholder="e.g., Customer Database"
          required 
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase mb-2 text-gray-400">Threat Description</label>
        <input 
          className="w-full bg-black border border-white/20 rounded px-4 py-3 text-white placeholder-gray-600 focus:border-white/40 focus:outline-none transition-colors" 
          value={formData.threat}
          onChange={e => setFormData({...formData, threat: e.target.value})}
          placeholder="e.g., SQL Injection Attack"
          required 
        />
      </div>

      <div className="relative pt-2">
        <div className="flex justify-between items-center mb-3">
           <span className="text-xs font-bold uppercase text-gray-400">Likelihood</span>
           <span className="text-white text-2xl font-mono font-bold">{formData.likelihood}</span>
        </div>
        
        <div className="relative h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-2"></div>
        
        <input 
          type="range" min="1" max="5" 
          className="w-full h-2 bg-transparent appearance-none cursor-pointer -mt-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black"
          value={formData.likelihood} 
          onChange={e => setFormData({...formData, likelihood: parseInt(e.target.value)})}
        />
        
        <div className="flex justify-between text-xs text-gray-600 font-mono mt-1">
          <span>Low (1)</span>
          <span>High (5)</span>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="flex justify-between items-center mb-3">
           <span className="text-xs font-bold uppercase text-gray-400">Impact</span>
           <span className="text-white text-2xl font-mono font-bold">{formData.impact}</span>
        </div>
        
        <div className="relative h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-2"></div>
        
        <input 
          type="range" min="1" max="5" 
          className="w-full h-2 bg-transparent appearance-none cursor-pointer -mt-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black"
          value={formData.impact} 
          onChange={e => setFormData({...formData, impact: parseInt(e.target.value)})}
        />
        
        <div className="flex justify-between text-xs text-gray-600 font-mono mt-1">
          <span>Low (1)</span>
          <span>High (5)</span>
        </div>
      </div>

      <div className="bg-black border border-white/10 p-5 rounded-lg flex flex-wrap justify-between items-center gap-4 mt-6">
        <div>
           <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">Projected Risk Score</span>
           <div className="text-4xl font-bold text-white font-mono">{preview.score}</div>
        </div>
        <div className={`px-5 py-2.5 rounded font-bold border-2 text-sm uppercase tracking-wider ${
          preview.level === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/40' : 
          preview.level === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/40' : 
          preview.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40' : 
          'bg-green-500/10 text-green-400 border-green-500/40'
        }`}>
          {preview.level}
        </div>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded font-bold transition-all text-sm md:text-base mt-6"
      >
        Confirm Assessment
      </button>

    </form>
  );
};

export default RiskForm;