import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RiskForm = ({ onRiskAdded }) => {
  const [formData, setFormData] = useState({ asset: '', threat: '', likelihood: 3, impact: 3 });
  const [preview, setPreview] = useState({ score: 9, level: 'Medium' });

  // Real-time calculation 
  useEffect(() => {
    const score = formData.likelihood * formData.impact;
    let level = 'Low';
    if (score > 5) level = 'Medium';
    if (score > 12) level = 'High';
    if (score > 18) level = 'Critical';
    setPreview({ score, level });
  }, [formData.likelihood, formData.impact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/assess-risk', formData); // [cite: 64]
      onRiskAdded(); // Refresh parent
      alert('Risk added!');
      setFormData({ asset: '', threat: '', likelihood: 3, impact: 3 });
    } catch (err) {
      alert('Error adding risk');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">Add New Risk</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="Asset Name" 
          className="border p-2 rounded" 
          value={formData.asset}
          onChange={e => setFormData({...formData, asset: e.target.value})}
          required 
        />
        <input 
          placeholder="Threat" 
          className="border p-2 rounded" 
          value={formData.threat}
          onChange={e => setFormData({...formData, threat: e.target.value})}
          required 
        />
        
        {/* Sliders for Likelihood/Impact [cite: 62] */}
        <div>
          <label>Likelihood (1-5): {formData.likelihood}</label>
          <input 
            type="range" min="1" max="5" 
            className="w-full"
            value={formData.likelihood}
            onChange={e => setFormData({...formData, likelihood: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <label>Impact (1-5): {formData.impact}</label>
          <input 
            type="range" min="1" max="5" 
            className="w-full"
            value={formData.impact}
            onChange={e => setFormData({...formData, impact: parseInt(e.target.value)})}
          />
        </div>

        {/* Real-time Preview */}
        <div className="md:col-span-2 bg-gray-100 p-2 text-center rounded">
          <strong>Preview:</strong> Score: {preview.score} | Level: <span className={`
            font-bold ${preview.level === 'Critical' ? 'text-red-600' : 
                        preview.level === 'High' ? 'text-orange-500' : 
                        preview.level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}
          `}>{preview.level}</span>
        </div>
        
        <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit Assessment
        </button>
      </form>
    </div>
  );
};

export default RiskForm;