import React from 'react';

export function ProgressBar({ 
  current, 
  target, 
  outstanding = 0,
  label = '',
  showPercentage = true,
  showTooltip = true,
  className = ''
}) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
  const outstandingPercentage = target > 0 ? Math.round((outstanding / target) * 100) : 0;
  
  const getProgressColor = (percentage) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage < 25) return 'bg-red-100';
    if (percentage < 50) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const progressColor = getProgressColor(percentage);
  const bgColor = getProgressBgColor(percentage);
  
  const tooltipText = showTooltip ? 
    `${percentage}% مكتمل - ${current.toLocaleString()} من ${target.toLocaleString()}${outstanding > 0 ? ` (غير مقبوض: ${outstanding.toLocaleString()})` : ''}` : 
    '';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{percentage}%</span>
          )}
        </div>
      )}
      
      <div className="relative">
        <div 
          className={`relative w-full h-6 ${bgColor} rounded-full overflow-hidden`}
          title={tooltipText}
        >
          {/* Main progress bar */}
          <div 
            className={`h-full ${progressColor} transition-all duration-300 flex items-center justify-center text-xs font-medium text-white relative z-10`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            {percentage > 15 && showPercentage && `${percentage}%`}
          </div>
          
          {/* Outstanding amounts overlay (striped pattern) */}
          {outstanding > 0 && (
            <div 
              className="absolute top-0 h-full bg-orange-300 opacity-60 bg-stripes"
              style={{ 
                left: `${Math.min(percentage, 100)}%`,
                width: `${Math.min(outstandingPercentage, 100 - Math.min(percentage, 100))}%`
              }}
            />
          )}
          
          {/* Percentage text for low progress */}
          {percentage <= 15 && showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700 z-20">
              {percentage}%
            </div>
          )}
        </div>
        
        {/* Outstanding amounts info */}
        {outstanding > 0 && (
          <div className="mt-1 text-xs text-orange-600">
            مبالغ غير مقبوضة: {outstanding.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressBar;
