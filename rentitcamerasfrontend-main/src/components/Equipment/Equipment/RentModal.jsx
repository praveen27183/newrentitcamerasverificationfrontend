import React, { useState, useCallback, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const RentModal = ({
  isOpen,
  onClose,
  product,
  rentalDays,
  onRentConfirm,
  loading = false,
  success = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickupDate: '',
    returnDate: ''
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        name: '',
        phone: '',
        pickupDate: '',
        returnDate: ''
      });
      setShowSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.pickupDate && formData.returnDate) {
      const start = new Date(formData.pickupDate);
      const end = new Date(formData.returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const days = Math.max(1, diffDays);
      const basePrice = product.price * days;
      const discount = days >= 3 ? 0.15 : 0;
      setTotalPrice(basePrice * (1 - discount));
    }
  }, [formData.pickupDate, formData.returnDate, product.price]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // payment intergration should be added here 
    // Prepare the booking details message
    const bookingDetails = `*Booking Details*\n` +
      `Product: ${product.name} (${product.category})\n` +
      `Pickup Date: ${formData.pickupDate}\n` +
      `Return Date: ${formData.returnDate}\n` +
      `Total Price: ₹${totalPrice.toFixed(2)}\n\n` +
      `*Customer Details*\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n\n` +
      `*Note*: Payment integration is coming soon. For now, we'll confirm your booking via WhatsApp and arrange payment details.`;
    
    // Open WhatsApp with the booking details
    window.open(`https://wa.me/919940423791?text=${encodeURIComponent(bookingDetails)}`, '_blank');
    
    // Close the modal after a short delay
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleWhatsAppClick = () => {
    const message = `Hi! I want to book: ${product.name} (${product.category}) ` +
      `for ${formData.pickupDate} to ${formData.returnDate}. ` +
      `Price: ₹${totalPrice.toFixed(2)}`;
    
    window.open(`https://wa.me/919940423791?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Rent {product.name}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                {showSuccess ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <FaCheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900">Booking Successful!</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We've sent a confirmation to your email. Our team will contact you shortly.
                    </p>
                    <div className="mt-5">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1A97A9] text-base font-medium text-white hover:bg-[#167a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] sm:text-sm"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1A97A9] focus:border-[#1A97A9] sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1A97A9] focus:border-[#1A97A9] sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">
                          <FaCalendarAlt className="inline mr-1" /> Pickup Date
                        </label>
                        <input
                          type="date"
                          name="pickupDate"
                          id="pickupDate"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.pickupDate}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1A97A9] focus:border-[#1A97A9] sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                          <FaCalendarAlt className="inline mr-1" /> Return Date
                        </label>
                        <input
                          type="date"
                          name="returnDate"
                          id="returnDate"
                          required
                          min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                          value={formData.returnDate}
                          onChange={handleChange}
                          disabled={!formData.pickupDate}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1A97A9] focus:border-[#1A97A9] sm:text-sm disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {totalPrice > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700">Total Price:</span>
                          <span className="text-lg font-bold text-[#1A97A9]">
                            ₹{totalPrice.toLocaleString()}
                          </span>
                        </div>
                        {formData.returnDate && formData.pickupDate && (
                          <div className="mt-1 text-xs text-gray-500">
                            {Math.ceil(
                              (new Date(formData.returnDate) - new Date(formData.pickupDate)) / (1000 * 60 * 60 * 24)
                            ) || 1} day rental
                          </div>
                        )}
                      </div>
                    )}

                    {error && (
                      <div className="text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A97A9] hover:bg-[#167a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Confirm Booking'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleWhatsAppClick}
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FaWhatsapp /> WhatsApp Us
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentModal;
