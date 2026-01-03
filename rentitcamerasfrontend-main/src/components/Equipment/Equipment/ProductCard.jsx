import React from 'react';
import { FaMapMarkerAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

const ProductCard = ({ 
  product, 
  rentalDays, 
  onRentClick, 
  getRandomLocation,
  isMobile = false
}) => {
  const priceNum = Number(product.price) || 0;
  const total = rentalDays > 0 ? priceNum * rentalDays : priceNum;
  const discountedTotal = rentalDays >= 3 ? Math.floor(total * 0.85) : total;

  return (
    <div 
      className={`bg-white rounded-2xl shadow-md p-5 relative flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 ${
        isMobile ? 'w-full' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="bg-[#1A97A9] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <FaCheckCircle className="w-4 h-4 inline-block" />
          {product.isAvailable === false ? 'Rented' : 'Available'}
        </span>
      </div>
      
      <div className="h-52 bg-gray-50 rounded-xl mb-5 flex items-center justify-center overflow-hidden border border-gray-100">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Equipment'} 
          alt={`${product.name} - Professional camera equipment for rent`} 
          className="w-full h-full object-contain p-4" 
        />
      </div>
      
      <span className="bg-gray-100 text-[#1A97A9] text-xs font-semibold px-3 py-1 rounded-full w-max mb-2">
        {product.category || 'Camera'}
      </span>
      
      <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-[3rem] flex items-start">{product.name}</h3>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <FaMapMarkerAlt className="mr-1 text-[#1A97A9]" size={14} />
        {product.location || getRandomLocation()}
      </div>
      
      <div className="mt-auto pt-4">
        <div className="text-2xl font-bold text-[#1A97A9] mb-1">
          ₹{rentalDays > 0 ? discountedTotal.toLocaleString() : priceNum.toLocaleString()}
          <span className="text-sm font-medium text-gray-500">
            {rentalDays > 0 ? '/total' : '/day'}
          </span>
          {rentalDays >= 3 && (
            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              15% OFF
            </span>
          )}
        </div>
        
        <div className="flex gap-3 mt-4 mb-3">
          <button
            className="flex-1 border border-[#1A97A9] text-[#1A97A9] px-3 py-2.5 rounded-lg font-semibold hover:bg-[#1A97A9]/10 transition-all duration-200 text-sm"
            onClick={() => setSelected(product)}
          >
            View Details
          </button>
          
          <button 
            className="flex-1 bg-[#1A97A9] text-white px-3 py-2.5 rounded-lg font-semibold hover:bg-[#167a8a] transition-all duration-200 text-sm shadow-sm"
            onClick={() => onRentClick(product)}
            disabled={product.isAvailable === false}
          >
            {product.isAvailable === false ? 'Rented' : 'Rent Now'}
          </button>
        </div>
        
        <a
  href={`https://wa.me/919940423791?text=${encodeURIComponent(
    `Hi, I want to book: ${product.name} (${product.category}) ` +
      `for ${rentalDays > 0 ? rentalDays : 1} day(s). ` +
      `Price: ₹${rentalDays > 0 ? discountedTotal : priceNum}${
        rentalDays > 0 ? " (with discount)" : ""
      }`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full flex items-center justify-center gap-2 rounded-xl 
             bg-green-500 px-6 py-2 text-white font-semibold text-base 
             shadow-md border border-green-400 transition-all duration-300 
             hover:bg-green-600 hover:shadow-lg hover:scale-[1.01]"
>
  {/* WhatsApp Icon */}
  <span className="flex items-center justify-center rounded-full bg-white p-1.5">
    <FaWhatsapp className="text-green-500 text-lg" />
  </span>

  {/* Button text */}
  <span>Book via WhatsApp</span>
</a>

      </div>
    </div>
  );
};

export default ProductCard;
