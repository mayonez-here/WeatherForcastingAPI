// src/components/Footer.jsx
import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'; // Using Font Awesome icons

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--card-bg-color)',
      padding: '1rem',
      textAlign: 'center',
      borderTop: '1px solid var(--border-color)',
      marginTop: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {/* GitHub */}
        <a 
          href="https://github.com/mayonez-here" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub size={24} color="var(--text-color)" />
        </a>

        {/* LinkedIn */}
        <a 
          href="https://www.linkedin.com/in/mohd-shonez-aa42b2289" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={24} color="#0A66C2" />
        </a>

        {/* Instagram */}
        <a 
          href="https://instagram.com/intricate_kestrel" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram size={24} color="#E1306C" />
        </a>
      </div>
      <p style={{ marginTop: '0.5rem', color: 'var(--text-color)' }}>
        © {new Date().getFullYear()} Created By Mohd Shonez
      </p>
    </footer>
  );
}