import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const equipment = [
  {
    id: 1,
    type: 'Camera',
    name: 'Sony Alpha A7 III',
    rating: 4.9,
    reviews: 245,
    features: ['24.2MP Full Frame', '4K Video', '5-axis stabilization'],
    location: 'KK Nagar',
    price: '₹1500',
    per: '/day',
    note: 'Best rates in Chennai',
    image: 'https://i.ibb.co/HTLmwHd3/Sony-a7-miii-with-28-70-lens.jpg', // Sony A7 III Body
    available: true,
  },
  {
    id: 2,
    type: 'Camera',
    name: 'Canon EOS R10',
    rating: 4.8,
    reviews: 187,
    features: ['24.2MP Full Frame', '4K Video', '28-70mm Lens'],
    location: 'Anna Nagar',
    price: '₹1200',
    per: '/day',
    note: 'With 18-150mm Lens',
    image: 'https://www.bhphotovideo.com/images/fb/canon_eos_r10_mirrorless_camera_1708098.jpg', // Canon R10 Body
    available: true,
  },
  {
    id: 3,
    type: 'Camera',
    name: 'Canon 80d',
    rating: 4.9,
    reviews: 156,
    features: ['24.2MP Full Frame', '4K Video', 'Twin Lens Kit'],
    location: 'KK Nagar',
    price: '₹1200',
    per: '/day',
    note: 'With 18-135mm Lens',
    image: 'https://i.ibb.co/SXTGBC2m/canon-eos-80d-front.jpg', // Canon 80d Body
    available: true,
  },
];

const FeaturedEquipment = ({ rentalDays }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentProduct, setRentProduct] = useState(null);
  const [form, setForm] = useState({ name: '',  phoneNumber: '', startDate: '', endDate: '' });

  const handleViewAll = () => {
    navigate('/equipments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRentNow = (item) => {
    setRentProduct(item);
    setShowRentModal(true);
  };
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRentSubmit = (e) => {
    e.preventDefault();
    
    // Format the WhatsApp message
    const message = `Hello! I would like to book ${rentProduct.name}%0A` +
                   `Name: ${form.name}%0A` +
                   `Phone: ${form.phoneNumber}%0A` +
                   `From: ${form.startDate} To: ${form.endDate}%0A%0A` +
                   'Please confirm the availability and payment details.';
    
    // Show confirmation alert
    if (window.confirm('Payment integration is coming soon. You will be redirected to WhatsApp to complete your booking. Continue?')) {
      // Open WhatsApp with the message
      window.open(`https://wa.me/919940423791?text=${message}`, '_blank');
      
      // Reset form and close modal
      setShowRentModal(false);
      setForm({ name: '', phoneNumber: '', startDate: '', endDate: '' });
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Featured Equipment</h2>
        <p className="text-center text-gray-600 mb-6">
          Professional camera gear available for rent in KK Nagar. Browse our collection of cameras, lenses, lights, and audio equipment.
        </p>
        <div className="flex justify-center mb-8">
          <button
            className="bg-[#1A97A9] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-teal-700 transition"
            onClick={handleViewAll}
          >
            View All Equipment
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipment.map((item) => {
            const priceNum = Number(item.price.replace(/[^\d]/g, ''));
            const total = rentalDays > 0 ? priceNum * rentalDays : priceNum;
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow p-4 relative flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-[#1A97A9] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Available
                  </span>
                  <button className="text-gray-400 hover:text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  </button>
                </div>
                <div className="h-48 bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={`${item.name} - Professional camera equipment for rent`} 
                    className="w-full h-full object-contain p-4" 
                  />
                </div>
                <span className="bg-gray-100 text-[#1A97A9] text-xs font-semibold px-3 py-1 rounded-full w-max mb-2">{item.type}</span>
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="text-yellow-500 font-bold mr-1">★</span>
                  {item.rating} <span className="ml-1">({item.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.features.map((feature, idx) => (
                    <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded-full">{feature}</span>
                  ))}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4 mr-1 text-[#1A97A9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {item.location}
                </div>
                <div className="text-2xl font-bold text-[#1A97A9] mb-1">
                  ₹{total}
                  <span className="text-base font-medium text-gray-500">{rentalDays > 0 ? '/total' : item.per}</span>
                </div>
                <div className="text-xs text-gray-400 mb-3">{item.note}</div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 border border-[#1A97A9] text-[#1A97A9] px-3 py-2 rounded-lg font-semibold hover:bg-[#167a8a] hover:text-white transition"
                    onClick={() => setSelected(item)}
                  >
                    View Details
                  </button>
                  <button className="flex-1 bg-[#1A97A9] text-white px-3 py-2 rounded-lg font-semibold hover:bg-[#167a8a]  transition" onClick={() => handleRentNow(item)}>Rent Now</button>
                </div>
                <button
                  className="mt-2 bg-[#d5eff2] text-green-700 px-3 py-2 rounded-lg font-semibold w-full flex items-center justify-center gap-2 hover:bg-green-200 transition text-sm"
                  onClick={() => {
                    const msg = encodeURIComponent(`Hi, I want to book: ${item.name} (${item.type}) for ${rentalDays > 0 ? rentalDays : 1} day(s).`);
                    window.open(`https://wa.me/919940423791?text=${msg}`, '_blank');
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2.993c-7.18 0-13.007 5.827-13.007 13.007 0 2.299.603 4.541 1.747 6.51l-1.857 6.785a1.001 1.001 0 0 0 1.226 1.226l6.785-1.857a12.93 12.93 0 0 0 6.51 1.747c7.18 0 13.007-5.827 13.007-13.007S23.18 2.993 16 2.993zm0 23.014c-2.07 0-4.104-.553-5.872-1.6a1 1 0 0 0-.74-.09l-5.13 1.404 1.404-5.13a1 1 0 0 0-.09-.74A10.98 10.98 0 0 1 5.007 16c0-6.065 4.928-10.993 10.993-10.993S26.993 9.935 26.993 16 22.065 26.007 16 26.007zm5.44-7.13c-.298-.149-1.76-.867-2.034-.967-.273-.099-.472-.149-.67.15-.198.298-.767.967-.94 1.165-.173.198-.347.223-.645.075-.298-.149-1.259-.464-2.398-1.479-.887-.792-1.487-1.77-1.663-2.068-.173-.298-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.67-1.613-.918-2.21-.242-.582-.487-.502-.67-.511-.173-.007-.372-.009-.57-.009a1.1 1.1 0 0 0-.797.372c-.273.298-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.21 5.088 4.373.712.307 1.267.489 1.7.624.714.227 1.364.195 1.877.118.573-.085 1.76-.719 2.011-1.413.248-.694.248-1.277.173-1.413-.074-.136-.272-.223-.57-.372z"/>
                  </svg>
                  Book via WhatsApp
                </button>
              </div>
            );
          })}
        </div>
        {/* Modal for product details */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-2xl font-bold text-center mb-4">{selected.name}</h2>
              <img src={selected.image} alt={`${selected.name} - High-quality camera equipment`} className="w-full h-40 object-contain mb-4 rounded" />
              <div className="mb-2"><strong>Type:</strong> {selected.type}</div>
              <div className="mb-2"><strong>Location:</strong> {selected.location}</div>
              <div className="mb-2"><strong>Price:</strong> {selected.price} {selected.per}</div>
              <div className="mb-2"><strong>Rating:</strong> {selected.rating} ({selected.reviews} reviews)</div>
              <div className="mb-2"><strong>Features:</strong> {selected.features.join(', ')}</div>
              <div className="mb-2 text-xs text-gray-400">{selected.note}</div>
            </div>
          </div>
        )}
      {/* Rental Modal */}
      {showRentModal && rentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowRentModal(false)} aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">Rent {rentProduct.name}</h2>
            <form onSubmit={handleRentSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
              <input type="number" name="phoneNumber" placeholder="Your Phone Number" value={form.phoneNumber} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
              <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
              <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
              <div className="my-2 text-gray-700 text-sm">
                <strong>Summary:</strong><br />
                Product: {rentProduct.name}<br />
                Dates: {form.startDate} to {form.endDate}
              </div>
              <button type="submit" className="bg-[#1A97A9] hover:bg-[#167a8a] text-white px-6 py-2 rounded font-semibold w-full">Confirm & Pay</button>
            </form>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default FeaturedEquipment; 