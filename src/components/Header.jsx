import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-top">
          <span className="date">Saturday, February 21, 2026</span>
          <span className="edition">Vol. 1, No. 1</span>
          <span className="price">$2.50</span>
        </div>
        <div className="header-main">
          <Link to="/"><h1>COMMON SENSE 250</h1></Link>
          <div className="separator-line"></div>
          <p className="tagline">CIVICS • OPINIONS • HISTORY</p>
          <div className="separator-line-double"></div>
        </div>

        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/campaigns" onClick={() => setIsMenuOpen(false)}>Campaigns</Link></li>
            <li><Link to="/articles" onClick={() => setIsMenuOpen(false)}>Articles</Link></li>
            <li><Link to="/submit" onClick={() => setIsMenuOpen(false)}>Submit</Link></li>
            <li><Link to="/print" onClick={() => setIsMenuOpen(false)}>Print Edition</Link></li>
            <li><Link to="/subscribe" className="nav-subscribe-btn" onClick={() => setIsMenuOpen(false)}>Subscribe</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
