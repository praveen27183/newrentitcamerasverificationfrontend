import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from 'react-swipeable';

const collections = [
  {
    title: "DSLR CAMERAS",
    items: 45,
    description: "Professional DSLR and mirrorless cameras from Canon, Sony, Nikon",
    icon: <img className="w-8 h-8 filter invert brightness-0" src="https://cdn-icons-png.flaticon.com/128/11836/11836320.png" alt="" />,
    bg: "https://i.ibb.co/SXTGBC2m/canon-eos-80d-front.jpg",
  },
  {
    title: "MIRRORLESS CAMERAS",
    items: 18,
    description: "Sony mirrorless cameras and cinema cameras for video production",
    icon: <img className="w-8 h-8 filter invert brightness-0" src="https://cdn-icons-png.flaticon.com/128/1998/1998342.png" alt="" />,
    bg: "https://i.ibb.co/HTLmwHd3/Sony-a7-miii-with-28-70-lens.jpg",
  },
  {
    title: "CAMERA LENS",
    items: 35,
    description: "Wide range of prime and zoom lenses for all camera systems",
    icon: <img className="w-8 h-8 filter invert brightness-0" src="https://cdn-icons-png.flaticon.com/128/3249/3249932.png" alt="" />,
    bg: "https://sony.scene7.com/is/image/sonyglobalsolutions/2_Mobile?$largeImageMobile$",
  },
  {
    title: "FLASH",
    items: 28,
    description: "Studio strobes, LED panels, and continuous lighting solutions",
    icon: <img className="w-8 h-8 filter invert brightness-0" src="https://cdn-icons-png.flaticon.com/128/6473/6473213.png" alt="" />,
    bg: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRuo8vGpcEfyF1zGv3AbyJswUF6ceiSMHjNPcKIvnjNunpzeKDY9vq11z8kCDoczToJos-PZYkUTSJGC2JwlxuOkJKtw3XnF3Vsqcfw0hXou2xNR-c-zxKwcIUfx8e5Quw_gTc3_Q&usqp=CAc",
  },
  {
    title: "TRIPOD AND MONOPOD",
    items: 22,
    description: "Tripods, gimbals, and stabilization equipment for smooth shots",
    icon: <img className="w-8 h-8 filter invert brightness-0" src="https://cdn-icons-png.flaticon.com/128/1645/1645391.png" alt="" />,
    bg: "https://i.ibb.co/Wvfvsq98/Screenshot-2025-07-27-141602.png",
  },
  {
    title: "STUDIO LIGHTS",
    items: 20,
    description: "Professional studio lighting kits with softboxes and modifiers",
    icon: <img className="w-8 h-8 filter invert brightness-0" src="https://cdn-icons-png.flaticon.com/128/8497/8497286.png" alt="" />,
    bg: "https://m.media-amazon.com/images/I/61eQZ3AzvoL.jpg",
  },
  {
    title: "DRONES",
    items: 12,
    description: "Professional drones for aerial photography and videography",
    icon: <img className="w-8 h-8 filter invert brightness-0" src="https://cdn-icons-png.flaticon.com/128/7504/7504454.png" alt="" />,
    bg: "https://www.designinfo.in/wp-content/uploads/2025/05/dji-mini-4-pro-plus-3-485x485-optimized.webp",
  },
  {
    title: "ACTION CAMERAS",
    items: 15,
    description: "GoPro and Insta 360 action cameras with accessories for adventure shoots",
    icon: <img className="w-8 h-8 filter invert brightness-0" src="https://cdn-icons-png.flaticon.com/128/9031/9031447.png" alt="" />,
    bg: "https://x.imastudent.com/content/0063119_gopro-hero-13-black-creator-edition-bundle_500.png",
  },
];

const titleToType = {
  "DSLR CAMERAS": "dslr",
  "MIRRORLESS CAMERAS": "mirrorless",
  "CAMERA LENS": "lens",
  "FLASH": "flash",
  "TRIPOD AND MONOPOD": "tripod",
  "STUDIO LIGHTS": "studio",
  "DRONES": "drone",
  "ACTION CAMERAS": "action",
};

const EquipmentCollections = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextCollection = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === collections.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const prevCollection = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? collections.length - 1 : prevIndex - 1
    );
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && nextCollection(),
    onSwipedRight: () => isMobile && prevCollection(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const renderCollection = (col, index) => {
    const isActive = currentIndex === index;
    const typeParam = titleToType[col.title.trim().toUpperCase()] || 
                     col.title.trim().toLowerCase().replace(/\s+/g, "");
    
    return (
      <div
        key={col.title}
        className={`relative rounded-3xl overflow-hidden shadow-lg cursor-pointer min-h-[280px] transition-all duration-300 ${
          isMobile 
            ? `absolute inset-0 w-full ${isActive ? 'opacity-100 z-10' : 'opacity-0 -z-10'}` 
            : ''
        }`}
        onClick={() => navigate(`/collection?type=${typeParam}`)}
      >
        <img
          src={col.bg}
          alt={col.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition"
        />

        <div className="relative z-10 p-6 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2">
            <div className="bg-[#1A97A9]/80 rounded-lg p-2 flex items-center justify-center shadow-lg">
              {col.icon}
            </div>
            <span className="ml-auto bg-white/80 text-[#1A97A9] text-xs font-semibold px-3 py-1 rounded-full shadow">
              {col.items} items
            </span>
          </div>

          <div className="mt-6 text-left">
            <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{col.title}</h3>
            <p className="text-white/90 text-sm drop-shadow-lg">{col.description}</p>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#1A97A9] transition pointer-events-none" />
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#1A97A9] to-[#153c43] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2 drop-shadow-lg">Equipment Collections</h2>
        <p className="text-center text-white/80 mb-12 text-lg max-w-2xl mx-auto">
          Browse our carefully curated collections of professional camera gear. From cameras to lighting, we have everything you need for your creative projects.
        </p>

        <div className="relative">
          {isMobile && (
            <>
              <button 
                onClick={prevCollection}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-all"
                aria-label="Previous collection"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1A97A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextCollection}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-all"
                aria-label="Next collection"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1A97A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Dots indicator */}
              <div className="flex justify-center mt-6 gap-2 absolute bottom-4 left-0 right-0 z-10">
                {collections.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentIndex === idx ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                    aria-label={`Go to collection ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <div 
            {...swipeHandlers}
            className={`grid ${
              isMobile 
                ? 'grid-cols-1 h-[350px] relative' 
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'
            }`}
          >
            {isMobile 
              ? renderCollection(collections[currentIndex], currentIndex)
              : collections.map((col, index) => renderCollection(col, index))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentCollections;
