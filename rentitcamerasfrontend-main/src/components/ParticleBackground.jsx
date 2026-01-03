import React, { useEffect } from "react";

const ParticlesComponent = ({ textColor = "white" }) => {
  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    loadScript("https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js").then(() => {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#ffffff" },
            polygon: { nb_sides: 5 }
          },
          opacity: {
            value: 0.5,
            random: false
          },
          size: {
            value: 3,
            random: true
          },
          line_linked: {
            enable: true,
            distance: 300, // 👈 updated distance
            color: "#ffffff",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 4,
            direction: "none",
            out_mode: "out"
          }
        },
        interactivity: {
          detect_on: "window",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "bubble" },
            resize: true
          },
          modes: {
            repulse: { distance: 200, duration: 0.4 },
            bubble: {
              distance: 300,
              size: 10,
              duration: 2,
              opacity: 0.8,
              speed: 3
            }
          }
        },
        retina_detect: true
      });
    });
  }, []);

  return (
    <>
      <div id="particles-js" style={styles.particles}></div>
      <div style={{ ...styles.overlayText, color: textColor }}>
        
      </div>
    </>
  );
};

const styles = {
  particles: {
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundColor: "#1A97A9",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: -1,
  },
  overlayText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "2.5rem",
    fontWeight: "bold",
    fontFamily: "Segoe UI, sans-serif",
    textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
    zIndex: 1,
  }
};

export default ParticlesComponent;
