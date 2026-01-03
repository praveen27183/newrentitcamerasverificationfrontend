import React from 'react';

const stats = [
  { value: 2000, label: 'Happy Customers', icon: (
    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1A97A9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0zm6 2a2 2 0 11-4 0 2 2 0 014 0zm-16 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ) },
  { value: 5000, label: 'Successful Rentals', icon: (
    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1A97A9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l1 2h13l1-2h2M5 10V7a2 2 0 012-2h10a2 2 0 012 2v3m-1 4v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" /></svg>
  ) },
  { value: 4.9, label: 'Average Rating', icon: (
    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1A97A9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
  ) },
  { value: 24, label: 'Customer Support', sub: '/7', icon: (
    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1A97A9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 115.636 18.364 9 9 0 0118.364 5.636z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" /></svg>
  ) },
];

// Count-up animation hook (supports decimals)
function useCountUpWhenVisible(end, duration = 1200, decimals = 0, startAnimation) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!startAnimation) return;
    let start = 0;
    const step = (end / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(Number(end.toFixed(decimals)));
        clearInterval(interval);
      } else {
        setCount(Number(start.toFixed(decimals)));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [end, duration, decimals, startAnimation]);
  return count;
}

const StatsBar = () => {
  const sectionRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  React.useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Split stats into two rows on mobile
  const firstRow = isMobile ? stats.slice(0, 2) : stats;
  const secondRow = isMobile ? stats.slice(2) : [];

  const renderStatCard = (stat, idx) => {
    let count;
    if (idx === 2 || (isMobile && idx === 0 && secondRow.length > 0)) {
      // For rating (3rd item on desktop, 1st of second row on mobile)
      count = useCountUpWhenVisible(stat.value, 1200, 1, visible);
    } else if (typeof stat.value === 'number' && stat.value > 10) {
      count = useCountUpWhenVisible(stat.value, 1200, 0, visible);
    } else {
      count = stat.value;
    }

    return (
      <div key={stat.label} className="w-1/2 md:w-auto px-2 md:px-0 mb-6 md:mb-0">
        <div className="bg-white/80 md:bg-transparent rounded-xl p-4 md:p-0 h-full flex flex-col items-center text-center">
          <div className="mb-2 md:mb-3 flex items-center justify-center">
            {stat.icon}
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-1 md:mb-2 bg-gradient-to-r from-[#1A97A9] to-[#207687] bg-clip-text text-transparent drop-shadow-lg flex items-end justify-center">
            {count}
            {stat.sub && <span className="text-xl md:text-3xl font-bold text-[#1A97A9] ml-1">{stat.sub}</span>}
            {stat.value === 4.9 && <span className="text-xl md:text-3xl font-bold text-yellow-400 ml-1">★</span>}
            {(stat.value === 2000 || stat.value === 5000) && (
              <span className="text-xl md:text-2xl font-bold text-[#1A97A9] ml-1">+</span>
            )}
          </div>
          <div className="text-sm sm:text-base md:text-lg text-[#1A97A9] font-medium opacity-80 tracking-wide">
            {stat.label}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="py-8 md:py-12 bg-gradient-to-b from-[#f7f6f3] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div 
          className="rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl bg-white/50 md:bg-white/30 backdrop-blur-sm md:backdrop-blur-md border border-white/40 py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-16"
          style={{boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.1)'}}
        >
          <div className="flex flex-wrap -mx-2 md:flex-nowrap md:justify-between md:gap-4 lg:gap-8">
            {firstRow.map((stat, idx) => renderStatCard(stat, idx))}
          </div>
          {isMobile && secondRow.length > 0 && (
            <div className="flex flex-wrap -mx-2 mt-4 md:hidden">
              {secondRow.map((stat, idx) => renderStatCard(stat, idx + 2))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;