import React from 'react';

const Loading = ({ fullScreen = true, message = 'Loading...' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-20'}`}>
      <div className="relative">
        {/* Outer circle */}
        <div className="w-16 h-16 border-4 border-[#1A97A9]/20 rounded-full"></div>
        
        {/* Inner circle with animation */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-[#1A97A9] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-b-[#1A97A9] border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin animation-delay-300"></div>
        </div>
        
        {/* Camera icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg 
            className="w-6 h-6 text-[#1A97A9]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            ></path>
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* Loading text */}
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      
      {/* Progress bar */}
      <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-[#1A97A9] rounded-full animate-loading-bar"></div>
      </div>
      
      {/* Add custom animation for the progress bar */}
      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 100%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default Loading;
