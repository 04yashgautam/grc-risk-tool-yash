import React from 'react';

const Heatmap = ({ risks }) => {
  // Initialize 5x5 grid (Likelihood x Impact)
  const grid = Array(6).fill().map(() => Array(6).fill(0));

  // Populate counts
  risks.forEach(r => {
    if(r.likelihood <= 5 && r.impact <= 5) {
      grid[r.likelihood][r.impact] += 1;
    }
  });

  // Color helper
  const getCellColor = (l, i) => {
    const score = l * i;
    if (score <= 5) return 'bg-green-200';
    if (score <= 12) return 'bg-yellow-200';
    if (score <= 18) return 'bg-orange-300';
    return 'bg-red-300';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-bold mb-4 text-center">Risk Heatmap (5x5)</h3>
      <div className="grid grid-cols-6 gap-1 text-sm">
        {/* Header Row */}
        <div className="col-span-1"></div>
        {[1,2,3,4,5].map(i => <div key={i} className="font-bold text-center">Imp {i}</div>)}

        {/* Matrix Rows */}
        {[1,2,3,4,5].map(likelihood => (
          <React.Fragment key={likelihood}>
            <div className="font-bold flex items-center justify-center">Like {likelihood}</div>
            {[1,2,3,4,5].map(impact => (
              <div 
                key={`${likelihood}-${impact}`}
                className={`h-12 border flex items-center justify-center font-bold ${getCellColor(likelihood, impact)}`}
                title={`${grid[likelihood][impact]} risks`} 
              >
                {grid[likelihood][impact] > 0 ? grid[likelihood][impact] : ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;