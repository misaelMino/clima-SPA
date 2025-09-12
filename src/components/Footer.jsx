import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { 
  FaCloud, 
  FaHeart
} from "react-icons/fa";
import logo from "../assets/logo1.png";
import "./Footer.css";

export default function Footer() {
  const footerRef = useRef(null);
  const sectionsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fallback: asegurar que el contenido sea visible después de un tiempo
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
      if (footerRef.current) {
        gsap.set(footerRef.current, { opacity: 1, y: 0 });
      }
    }, 100);

    const ctx = gsap.context(() => {
      // Asegurar que el footer sea visible inicialmente
      gsap.set(footerRef.current, { opacity: 1, y: 0 });
      
      gsap.from(footerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.from(sectionsRef.current, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });
    });

    return () => {
      clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, []);

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Contacto",
      content: (
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-arrow">→</span>
            <a 
              href="https://maps.google.com/?q=Villa+María,+Córdoba,+Argentina"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              Villa María, Córdoba, Argentina
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-arrow">→</span>
            <a 
              href="https://wa.me/5493534128030"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              +54 9 3534 128030
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-arrow">→</span>
            <a 
              href="mailto:info@climaapp.com"
              className="contact-link"
            >
              info@climaapp.com
            </a>
          </div>
        </div>
      )
    }
  ];

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Logo Section - Left */}
          <div className="footer-logo-section">
            <img src={logo} alt="天气在你手中" className="footer-logo" />
            <div className="footer-brand-info">
              <h3 className="footer-brand-name">天气在你手中</h3>
              <p className="footer-description">
                Monitoreo en tiempo real de condiciones meteorológicas.
              </p>
              <div className="footer-data-source">
                <span className="data-source-text">Datos proporcionados por</span>
                <a 
                  href="https://open-meteo.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="data-source-link"
                >
                  OpenMeteo
                </a>
              </div>
            </div>
          </div>

          {/* Right Sections */}
          <div className="footer-right-sections">
            {footerSections.map((section, index) => (
              <div 
                key={index}
                ref={(el) => (sectionsRef.current[index] = el)}
                className="footer-section"
              >
                <h3 className="footer-section-title">{section.title}</h3>
                {section.content ? (
                  section.content
                ) : (
                  <ul className="footer-links">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.href.startsWith('/') ? (
                          <Link to={link.href} className="footer-link">
                            {link.label}
                          </Link>
                        ) : (
                          <a href={link.href} className="footer-link">
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} 天气在你手中. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
      
      <div className="footer-decoration">
        <FaCloud className="footer-cloud cloud-1" />
        <FaCloud className="footer-cloud cloud-2" />
        <FaCloud className="footer-cloud cloud-3" />
      </div>
    </footer>
  );
}