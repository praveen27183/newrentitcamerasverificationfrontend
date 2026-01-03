import React from 'react';

const NotFoundEquipment = () => {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-[#faf9f6] border-2 border-emerald-200 rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">Can't Find What You're Looking For?</h2>
      <p className="text-gray-600 mb-7">
        We have over 200+ pieces of professional equipment. Contact us for custom requirements or special equipment not listed in our collections.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12 12 0 0 0 3.48 20.52l-1.32 4.84a1 1 0 0 0 1.22 1.22l4.84-1.32A12 12 0 1 0 20.52 3.48zm-8.52 17.02a10 10 0 1 1 7.07-2.93A10 10 0 0 1 12 20.5zm5.2-7.2c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.61-.48-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" /></svg>
          WhatsApp Us
        </a>
        <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow transition">
          View All Equipment
        </button>
      </div>
    </div>
  );
};

export default NotFoundEquipment; 