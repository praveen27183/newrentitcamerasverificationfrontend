import React, { useState, useEffect, useCallback } from 'react';
import { FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';

const blogs = [
  {
    category: 'Camera Rental Chennai',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    title: 'Affordable Camera Rental in Chennai – Complete Guide',
    summary: 'Discover the best camera rental options in Chennai, compare prices, and find the perfect gear for your next shoot.',
    author: 'Ravi Kumar',
    date: '15/1/2025',
    readTime: '5 min read',
  },
  {
    category: 'Wedding Photography Chennai',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Best Camera Settings for Wedding Photography in Chennai',
    summary: 'Learn how to capture perfect Chennai wedding moments with the right camera settings and rental gear.',
    author: 'Priya Sharma',
    date: '12/1/2025',
    readTime: '6 min read',
  },
  {
    category: 'Lens Rental Chennai',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    title: 'How to Choose the Right Lens for Every Shoot in Chennai',
    summary: 'A local guide to selecting the best lens for portraits, landscapes, and events in Chennai. Includes rental recommendations.',
    author: 'Anjali Rao',
    date: '10/1/2025',
    readTime: '5 min read',
  },
  {
    category: 'Drone Photography Chennai',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    title: 'Drone Photography Rules & Rentals in Chennai',
    summary: 'Everything you need to know about Chennai’s drone regulations, permits, and where to rent aerial gear.',
    author: 'Anita Reddy',
    date: '8/1/2025',
    readTime: '6 min read',
  },
  {
    category: 'Video Gear Chennai',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    title: 'Lighting Equipment Guide for Video Shoots in Chennai',
    summary: 'Compare LED panels, softboxes, and more for Chennai-based video projects. Includes rental sources.',
    author: 'Rajesh Kumar',
    date: '5/1/2025',
    readTime: '7 min read',
  },
];

const BlogSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle responsive blog count without breaking SSR
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setCurrentIndex(0);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleBlogs = showAll ? blogs : blogs.slice(0, isMobile ? 2 : 4);
  const blogsPerView = isMobile ? 1 : 4;
  const totalSlides = Math.ceil(visibleBlogs.length / blogsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && nextSlide(),
    onSwipedRight: () => isMobile && prevSlide(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const getVisibleBlogs = () => {
    if (!isMobile) return visibleBlogs;
    const start = currentIndex * blogsPerView;
    return visibleBlogs.slice(start, start + blogsPerView);
  };

  return (
    <section className="py-16 bg-[#f7f6f3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Chennai Camera Rental Blog
        </h2>
        <p className="text-center text-gray-600 mb-12 text-base md:text-lg max-w-2xl mx-auto px-4">
          Tips, guides, and updates for photographers & videographers in Chennai. Learn how to get the best from your rental gear.
        </p>

        <div className="relative">
          {isMobile && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-all"
                aria-label="Previous slide"
              >
                <FaChevronLeft className="text-[#1A97A9] text-xl" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-all"
                aria-label="Next slide"
              >
                <FaChevronRight className="text-[#1A97A9] text-xl" />
              </button>
            </>
          )}
          
          <div 
            {...swipeHandlers}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 transition-transform duration-300 ease-out"
          >
            {getVisibleBlogs().map((blog, idx) => (
              <article
                key={idx}
                className="bg-white rounded-2xl shadow-md border-2 border-[#1A97A9] flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mx-2"
              >
                <div className="relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover" />
                  <span className="absolute top-3 left-3 bg-[#1A97A9] text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">
                    {blog.category}
                  </span>
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 leading-snug">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{blog.summary}</p>
                  <div className="flex items-center text-gray-400 text-xs mb-2 gap-4">
                    <span>{blog.author}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <div className="text-gray-400 text-xs mb-4">{blog.date}</div>

                  {/* WhatsApp CTA */}
                  <a
                    href={`https://wa.me/919940423791?text=Hi! I'm interested in camera rental in Chennai after reading your blog: ${encodeURIComponent(blog.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 bg-[#1A97A9] hover:bg-[green] text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                  >
                    <FaWhatsapp /> Rent Now
                  </a>
                </div>
              </article>
            ))}
          </div>

          {isMobile && totalSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentIndex === idx ? 'bg-[#1A97A9] w-6' : 'bg-gray-300'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {!showAll && !isMobile && (
          <div className="flex justify-center mt-10">
            <button
              className="bg-[#1A97A9] hover:bg-[#167a8a] text-white font-semibold px-8 py-3 rounded-lg shadow transition text-lg"
              onClick={() => setShowAll(true)}
            >
              View All Blogs
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
