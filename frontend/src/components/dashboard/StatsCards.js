import React from 'react';

const StatsCards = ({ risks }) => {
  const totalRisks = risks.length;
  const urgentRisks = risks.filter(r => r.level === 'High' || r.level === 'Critical').length;
  const totalScore = risks.reduce((acc, curr) => acc + curr.score, 0);
  const avgScore = totalRisks > 0 ? (totalScore / totalRisks).toFixed(1) : 0;

  const cards = [
    { 
      label: 'Total Vulnerabilities', 
      value: totalRisks, 
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      bgGlow: 'hover:shadow-orange-500/10'
    },
    { 
      label: 'Critical / High', 
      value: urgentRisks, 
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      bgGlow: 'hover:shadow-red-500/10'
    },
    { 
      label: 'Avg Risk Score', 
      value: avgScore, 
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      bgGlow: 'hover:shadow-blue-500/10'
    },
    { 
      label: 'Active Monitors', 
      value: '4/12', 
      borderColor: 'border-white/10',
      textColor: 'text-white',
      bgGlow: 'hover:shadow-white/5'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className={`bg-zinc-950 border ${card.borderColor} p-6 rounded-lg hover:border-opacity-50 transition-all hover:shadow-lg ${card.bgGlow}`}
        >

          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
            {card.label}
          </div>
          <div className={`text-4xl font-bold ${card.textColor} font-mono`}>
            {card.value}
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default StatsCards;