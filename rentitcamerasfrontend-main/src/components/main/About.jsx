import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const About = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };
  // CTA Handlers
const handleLocation = () => {
  window.open(
    'https://maps.app.goo.gl/nxdzEjd573GrGyma7',
    '_blank',
    'noopener,noreferrer'
  );
};

return (
  <div className="bg-gradient-to-br from-[#f0fbfc] via-white to-blue-50 min-h-screen py-0">
    {/* Hero Section */}
    <section className="relative flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-b from-[#1A97A9] to-[#153c43] text-white shadow-lg">
      <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4">
        About <span className="text-[#1A97A9]">RentIt Cameras</span>
      </h1>
      <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-6">
        Your trusted partner for professional camera gear rental in Chennai. Premium cameras, lenses, lighting, and audio equipment for every creator.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
      <a
  href="tel:+919940423791"
  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2 rounded-full shadow transition cursor-pointer"
>
  <Phone className="w-5 h-5" />
  +91 99404 23791
</a>
        <a
          href="mailto:info@rentitcameras.com"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2 rounded-full shadow transition cursor-pointer"
        >
          <Mail className="w-5 h-5" />
          info@rentitcameras.com
        </a>
        <button
          onClick={handleLocation}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2 rounded-full shadow transition cursor-pointer"
        >
          <MapPin className="w-5 h-5" />
          Find us on Google
        </button>
      </div>
    </section>

);  

      {/* Company Info & Contact - Desktop Layout */}
      <section className="max-w-7xl mx-auto mt-[-3rem] mb-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative z-10">
          {/* Mobile Layout - Stacked */}
          <div className="md:hidden space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#1A97A9] mb-4">Who We Are</h2>
              <p className="text-gray-700 text-lg mb-4">
                <span className="font-semibold text-[#1A97A9]">RentIt Cameras</span> is dedicated to empowering photographers, filmmakers, and content creators with access to the best camera gear—without the high cost of ownership. Whether you're shooting a wedding, a commercial, or a creative project, we have the equipment and expertise to help you succeed.
              </p>
              <ul className="space-y-3 text-gray-600 text-base">
                <li className="flex items-center gap-2 justify-center"><MapPin className="w-5 h-5 text-[#1A97A9]" /> Chennai, Tamil Nadu</li>
                <li className="flex items-center gap-2 justify-center"><Phone className="w-5 h-5 text-[#1A97A9]" /> +91 99404 23791</li>
                <li className="flex items-center gap-2 justify-center"><Mail className="w-5 h-5 text-[#1A97A9]" /> info@rentitcameras.com</li>
                <li className="flex items-center gap-2 justify-center"><Clock className="w-5 h-5 text-[#1A97A9]" /> Mon - Sat: 9:00 AM – 8:00 PM</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#E5F9FB] to-blue-100 rounded-xl p-6 shadow">
              <h3 className="text-xl font-semibold text-[#1A97A9] mb-2 text-center">Why Choose Us?</h3>
              <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                <li>Wide range of latest cameras, lenses, and accessories</li>
                <li>Flexible rental periods and affordable rates</li>
                <li>Expert support and guidance</li>
                <li>Easy online booking and doorstep delivery</li>
              </ul>
            </div>
          </div>

          {/* Desktop Layout - Three Column Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {/* Who We Are Section */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-[#1A97A9] mb-4">Who We Are</h2>
              <p className="text-gray-700 text-lg mb-4">
                <span className="font-semibold text-[#1A97A9]">RentIt Cameras</span> is dedicated to empowering photographers, filmmakers, and content creators with access to the best camera gear—without the high cost of ownership. Whether you're shooting a wedding, a commercial, or a creative project, we have the equipment and expertise to help you succeed.
              </p>
              <ul className="space-y-3 text-gray-600 text-base">
                <li className="flex items-center gap-2"><MapPin className="w-5 h-5 text-[#1A97A9]" /> Chennai, Tamil Nadu</li>
                <li className="flex items-center gap-2"><Phone className="w-5 h-5 text-[#1A97A9]" /> +91 99404 23791</li>
                <li className="flex items-center gap-2"><Mail className="w-5 h-5 text-[#1A97A9]" /> info@rentitcameras.com</li>
                <li className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#1A97A9]" /> Mon - Sun: 9:30 AM – 9:30 PM</li>
              </ul>
            </div>

            {/* Why Choose Us Section */}
            <div className="flex flex-col justify-center">
              <div className="bg-gradient-to-br from-[#E5F9FB] to-blue-100 rounded-xl p-6 shadow h-full">
                <h3 className="text-xl font-semibold text-[#1A97A9] mb-4">Why Choose Us?</h3>
                <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
                  <li>Wide range of latest cameras, lenses, and accessories</li>
                  <li>Flexible rental periods and affordable rates</li>
                  <li>Expert support and guidance</li>
                  <li>Easy online booking and doorstep delivery</li>
                  <li>Professional equipment maintenance</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>
            </div>

            {/* Branch Query Form */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-[#1A97A9] mb-4">Branch Query Form</h2>
              <p className="text-gray-600 mb-4 text-sm">Have a question or want to inquire about a specific branch? Fill out the form below and our team will get back to you soon.</p>
              <form onSubmit={handleSubmit} className="grid gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A97A9] text-sm"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A97A9] text-sm"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Query"
                  value={form.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A97A9] resize-none text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#1A97A9] hover:bg-[#166a78] transition-colors text-white px-4 py-2 rounded-lg font-semibold shadow text-sm"
                >
                  Submit Query
                </button>
                {submitted && (
                  <div className="text-green-600 text-center font-semibold mt-2 text-sm">Thank you! Your query has been submitted.</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Branch Query Form - Only show on mobile */}
      <section className="md:hidden max-w-2xl mx-auto mb-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-[#1A97A9] mb-4 text-center">Branch Query Form</h2>
          <p className="text-gray-600 mb-6 text-center">Have a question or want to inquire about a specific branch? Fill out the form below and our team will get back to you soon.</p>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A97A9]"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A97A9]"
              required
            />
            <textarea
              name="message"
              placeholder="Your Query"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A97A9] resize-none"
              required
            />
            <button
              type="submit"
              className="bg-[#1A97A9] hover:bg-[#166a78] transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow"
            >
              Submit Query
            </button>
            {submitted && (
              <div className="text-green-600 text-center font-semibold mt-2">Thank you! Your query has been submitted.</div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default About;
