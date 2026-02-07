import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Heatmap = ({ risks }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  // scroll prevent
  useEffect(() => {
    if (selectedCell) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCell]);

  const grid = Array(6).fill().map(() => Array(6).fill().map(() => []));

  risks.forEach(r => {
    if(r.likelihood >= 1 && r.likelihood <= 5 && r.impact >= 1 && r.impact <= 5) {
      grid[r.likelihood][r.impact].push(r);
    }
  });

  const getCellColor = (likelihood, impact) => {
    const score = likelihood * impact;
    if (score === 0) return 'bg-zinc-900/50 border-white/5'; 
    if (score <= 5) return 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20';
    if (score <= 12) return 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20';
    if (score <= 18) return 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20';
    return 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20';
  };

  const getCellTextColor = (likelihood, impact) => {
    const score = likelihood * impact;
    if (score === 0) return 'text-gray-700';
    if (score <= 5) return 'text-green-400';
    if (score <= 12) return 'text-yellow-400';
    if (score <= 18) return 'text-orange-400';
    return 'text-red-400';
  };

  const modalContent = (
    <div className="relative z-[99999]">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setSelectedCell(null)}
        style={{ width: '100vw', height: '100vh' }}
      />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-zinc-950 border border-white/20 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
            <div>
              <h4 className="font-bold text-white text-lg">Risk Details</h4>
              <div className="text-xs text-gray-400 mt-0.5">
                Likelihood {selectedCell?.like} × Impact {selectedCell?.imp} • <span className="text-white">{selectedCell?.risks.length} Items</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCell(null)} 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto custom-scrollbar space-y-3">
            {selectedCell?.risks.map((r, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all group">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{r.asset}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${
                    r.level === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                    r.level === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                    r.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                    'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>{r.level}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2 leading-relaxed">{r.threat}</p>
                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono border-t border-white/5 pt-2">
                  <span>ID: {r.id || 'N/A'}</span>
                  <span>Score: {r.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-zinc-950 p-6 rounded-lg border border-white/10 w-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Risk Matrix</h3>
        </div>
        
        <div className="grid grid-cols-6 gap-2 text-sm">
          <div className="col-span-1"></div>
          {[1,2,3,4,5].map(i => (
            <div key={`head-${i}`} className="font-bold text-center text-gray-500 text-[10px] uppercase tracking-wider pb-1">
              Impact {i}
            </div>
          ))}


          {[1,2,3,4,5].map(like => (
            <React.Fragment key={`row-${like}`}>
              <div className="font-bold flex items-center justify-center text-gray-500 text-[10px] uppercase tracking-wider -rotate-90 md:rotate-0">
                Like {like}
              </div>

              {[1,2,3,4,5].map(imp => {
                const cellRisks = grid[like][imp];
                const count = cellRisks.length;
                const cellKey = `${like}-${imp}`;
                const isHovered = hoveredCell === cellKey;
                const isTopRows = like <= 2;
                
                return (
                  <div 
                    key={cellKey}
                    className={`
                      relative h-12 md:h-14 border rounded transition-all duration-200 
                      flex items-center justify-center font-bold text-lg
                      ${getCellColor(like, imp)}
                      ${count > 0 ? 'cursor-pointer hover:scale-[1.05] hover:shadow-lg hover:z-50' : 'cursor-default'}
                    `}
                    onClick={() => count > 0 && setSelectedCell({ risks: cellRisks, like, imp })}
                    onMouseEnter={() => count > 0 && setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {count > 0 && (
                      <span className={`drop-shadow-sm ${getCellTextColor(like, imp)}`}>
                        {count}
                      </span>
                    )}
                    
                    {isHovered && count > 0 && (
                      <div 
                        className={`
                          absolute left-1/2 transform -translate-x-1/2 z-[100] w-64 pointer-events-none
                          ${isTopRows ? 'top-full mt-3' : 'bottom-full mb-3'}
                          animate-in fade-in zoom-in-95 duration-150
                        `}
                      >
                        <div className="bg-zinc-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden">
                          <div className={`px-3 py-2 border-b border-white/10 flex justify-between items-center ${
                             (like*imp) >= 13 ? 'bg-red-500/10' : 'bg-white/5'
                          }`}>
                            <span className="text-xs font-bold text-white">
                              {count} {count === 1 ? 'Risk' : 'Risks'} Found
                            </span>
                            <span className="text-[10px] font-mono text-white/50">
                              Score: {like * imp}
                            </span>
                          </div>

                          <div className="p-2 space-y-1.5 max-h-[150px] overflow-hidden">
                            {cellRisks.slice(0, 5).map((r, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  r.level === 'Critical' ? 'bg-red-500' : 
                                  r.level === 'High' ? 'bg-orange-500' :
                                  'bg-green-500'
                                }`}></div>
                                <span className="text-gray-300 truncate">{r.asset}</span>
                              </div>
                            ))}
                            {cellRisks.length > 5 && (
                              <div className="text-[10px] text-center text-gray-500 pt-1 border-t border-white/5 mt-1">
                                + {cellRisks.length - 5} more...
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`
                          absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-l border-t border-white/20 rotate-45
                          ${isTopRows ? '-top-1.5' : '-bottom-1.5 border-l-0 border-t-0 border-r border-b'}
                        `}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      {selectedCell && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default Heatmap;