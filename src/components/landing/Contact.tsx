"use client";

import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function Contact() {
  return (
    <footer 
      className="py-16"
      style={{ 
        background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 
              className="font-bold mb-4"
              style={{
                fontFamily: "var(--font-nunito, nunito, sans-serif)",
                fontSize: "1.25rem",
                color: "#fff"
              }}
            >
              Pawsitive
            </h3>
            <p style={{ color: "#8b8fa3", lineHeight: 1.7, fontSize: "0.9375rem" }}>
              Your trusted partner in pet care, offering tailored services to ensure the health, happiness, and well-being of your beloved furry companions.
            </p>
          </div>
          
          <div>
            <h4 
              className="font-bold mb-4"
              style={{ color: "#fff", fontSize: "0.9375rem" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {["Home", "Services", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    whileHover={{ x: 4 }}
                    transition={SPRING}
                    className="inline-block"
                    style={{ color: "#8b8fa3", fontSize: "0.875rem" }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 
              className="font-bold mb-4"
              style={{ color: "#fff", fontSize: "0.9375rem" }}
            >
              Contact Info
            </h4>
            <ul className="space-y-2.5" style={{ color: "#8b8fa3", fontSize: "0.875rem" }}>
              <li>123 PetCare Avenue, Cityville, USA</li>
              <li>1-800-PET-CARE</li>
              <li>Info@pawsitive.com</li>
            </ul>
          </div>
          
          <div>
            <h4 
              className="font-bold mb-4"
              style={{ color: "#fff", fontSize: "0.9375rem" }}
            >
              Follow Us
            </h4>
            <div className="flex gap-3">
              {[
                { icon: "📘", label: "Facebook" },
                { icon: "📷", label: "Instagram" },
                { icon: "🐦", label: "Twitter" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
                  aria-label={social.label}
                >
                  <span style={{ fontSize: "1.1rem" }}>{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
        <div 
          className="pt-8 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p style={{ color: "#5a6175", fontSize: "0.8125rem" }}>
            © 2024 Pawsitive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
