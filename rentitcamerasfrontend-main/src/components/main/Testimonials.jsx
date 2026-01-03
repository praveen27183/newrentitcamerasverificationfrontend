import React, { useState, useEffect, useMemo } from "react";
import { useSwipeable } from "react-swipeable";

// --- SVG Icons ---
const CameraIcon = () => (
  <svg
    className="w-5 h-5 ml-2 text-white inline-block"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <circle cx="12" cy="13.5" r="3.5" />
  </svg>
);

const LightingIcon = () => (
  <svg
    className="w-5 h-5 ml-2 text-white inline-block"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
  </svg>
);

// --- Testimonials Data ---
const testimonials = [
  {
    text: `"We rented a camera for our 6-day event and had a great experience. The camera was user-friendly and performed really well throughout the event. The rental service was smooth. Everything was delivered on time, and the overall support exceeded our expectations. Highly recommend their service."`,
    equipment: "Canon EOS R10 + RF-S 18-150mm",
    project: "COOPERATE EVENT",
    user: {
      name: "Pravalika Pravali",
      role: "manager",
      company: "ZOHO",
      avatar:
        "https://lh3.googleusercontent.com/a-/ALV-UjXp4RkfBm8J1MNQhUD27PxcxMHJfCnAeltwVu69eq-ZYKhOXA8=w65-h65-p-rp-mo-br100",
    },
    stars: 5,
    equipmentIcon: <CameraIcon />,
  },
  // --- other testimonials omitted for brevity, same as your data ---
  {
    text: `"My experience with Rent it was excellent. They had a wide range of equipment, and the camera I rented performed flawlessly. The staff was super helpful and made the entire process easy. I will recommend this shop to my friends looking to rent gear!"`,
    equipment: "Godox Lighting Kit + Gimbal",
    project: "Commercial Video",
    user: {
      name: "Dhana",
      role: "college student",
      company: "ETHIRAJ",
      avatar:
        "https://lh3.googleusercontent.com/a-/ALV-UjUCOXD-E4kDRWmazcUigjSph9tBnrrJCH6hoUaDa9vgBLADxEA=w65-h65-p-rp-mo-br100",
    },
    stars: 5,
    equipmentIcon: <LightingIcon />,
  },
];

// --- Hook: Media Query ---
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// --- Component ---
const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [isSwiping, setIsSwiping] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const total = testimonials.length;
  const visibleCount = isMobile ? 1 : 3;
  const maxWords = 30;

  // --- Navigation ---
  const prev = () => setIndex((i) => (i - visibleCount + total) % total);
  const next = () => setIndex((i) => (i + visibleCount) % total);

  // --- Auto Rotate ---
  useEffect(() => {
    if (isSwiping) return;
    const timer = setInterval(() => next(), 8000);
    return () => clearInterval(timer);
  }, [isSwiping, isMobile]);

  // --- Swipe Handlers ---
  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    onSwiping: () => setIsSwiping(true),
    trackMouse: true,
    delta: 10,
  });

  // --- Visible Testimonials ---
  const visible = useMemo(() => {
    return Array.from({ length: visibleCount }, (_, i) =>
      testimonials[(index + i) % total]
    );
  }, [index, visibleCount, total]);

  // --- Render Text with Read More ---
  const renderText = (text, idx) => {
    const words = text.split(" ");
    const isExpanded = expanded[idx];
    const display = isExpanded ? text : words.slice(0, maxWords).join(" ");

    return (
      <p className="mb-4 text-white/90 text-sm sm:text-base leading-relaxed">
        {display}
        {words.length > maxWords && (
          <button
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))
            }
            className="text-cyan-200 hover:text-white ml-1"
          >
            {isExpanded ? "...Show Less" : "...Read More"}
          </button>
        )}
      </p>
    );
  };

  return (
    <section
      className="py-12 bg-gradient-to-b from-[#1A97A9] to-[#0f2e34] text-white relative overflow-hidden"
      {...swipeHandlers}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What Our Customers Say
        </h2>
        <p className="text-center text-white/90 mb-10 max-w-2xl mx-auto">
          Join thousands of satisfied photographers, videographers, and content
          creators who trust RentIt Cameras for their projects.
        </p>

        {/* Controls */}
        <div className="flex justify-between md:absolute md:top-1/2 md:left-0 md:right-0 md:px-6 md:-translate-y-1/2">
          <button
            onClick={prev}
            className="bg-white/20 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ←
          </button>
          <button
            onClick={next}
            className="bg-white/20 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center"
          >
            →
          </button>
        </div>

        {/* Cards */}
        <div
          className={`grid gap-6 md:gap-8 ${
            isMobile ? "grid-cols-1" : "md:grid-cols-3"
          }`}
        >
          {visible.map((t, idx) => (
            <div
              key={idx}
              className="bg-white/10 p-6 rounded-2xl shadow-xl hover:bg-white/15 transition"
            >
              {/* Stars */}
              <div className="flex justify-between mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/32/32355.png"
                  alt="quote"
                  className="w-6 h-6 opacity-80"
                />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < t.stars ? "text-yellow-400" : "text-white/20"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.382 2.455a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54 1.118l-3.382-2.455a1 1 0 00-1.175 0l-3.382 2.455c-.784.57-1.838-.197-1.539-1.118l1.285-3.967a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
              </div>

              {renderText(t.text, idx)}

              {/* Equipment */}
              <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                <div className="font-semibold mb-1">Equipment Used:</div>
                <div className="text-cyan-200 flex items-center gap-1">
                  {t.equipment} {t.equipmentIcon}
                </div>
                <div className="text-xs text-white/60">Project: {t.project}</div>
              </div>

              {/* User */}
              <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                <img
                  src={t.user.avatar}
                  alt={t.user.name}
                  className="w-12 h-12 rounded-full border-2 border-cyan-400/50 object-cover"
                />
                <div>
                  <div className="font-bold">{t.user.name}</div>
                  <div className="text-sm text-white/80">{t.user.role}</div>
                  {t.user.company && (
                    <div className="text-xs text-white/60">{t.user.company}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
