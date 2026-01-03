import React from "react";

const steps = [
  {
    number: 1,
    icon: (
      <svg
        className="w-8 h-8 text-[#1A97A9]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
      </svg>
    ),
    title: "Browse & Select",
    desc: "Choose from our wide range of professional camera gear, lenses, lights, and audio equipment.",
  },
  {
    number: 2,
    icon: (
      <svg
        className="w-8 h-8 text-[#1A97A9]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    title: "Pick Your Dates",
    desc: "Select your rental period and pickup location. We offer flexible timing to suit your project needs.",
  },
  {
    number: 3,
    icon: (
      <svg
        className="w-8 h-8 text-[#1A97A9]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M2 11h20" />
      </svg>
    ),
    title: "Secure Payment",
    desc: "Pay securely with Razorpay. Choose to pay full amount or just an advance to confirm your booking.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#f7f6f3] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-3 text-gray-900">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-12 text-base sm:text-lg max-w-2xl mx-auto">
          Renting professional camera gear has never been easier. Get started in just 3 simple steps.
        </p>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row md:justify-between gap-12 md:gap-8">
          {/* Horizontal line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 z-0">
            <div className="w-full h-0.5 bg-[#1A97A9]/20 mx-24"></div>
          </div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center text-center z-10"
            >
              {/* Number */}
              <div className="w-16 h-16 bg-[#1A97A9] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 shadow-lg relative">
                {step.number}
              </div>
              {/* Icon */}
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow mb-5 -mt-2 border border-[#1A97A9]/20">
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-14">
          <button
            className="bg-[#1A97A9] hover:bg-[#166a78] text-white font-semibold px-8 py-3 sm:px-10 sm:py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-base sm:text-lg"
            onClick={() => {
              const msg = encodeURIComponent(
                "Hi, I am interested in renting camera equipment from RentIt Cameras. Please provide more details."
              );
              window.open(`https://wa.me/919940423791?text=${msg}`, "_blank");
            }}
          >
            Start Renting Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
