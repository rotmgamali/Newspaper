import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Common Sense 250</h3>
                        <p>A Personal Press of Andrew Rollins Web4Guru</p>
                        <p>Publishing opinions on CIVICS in New England.</p>
                        <p>Est. 2026</p>
                    </div>
                    <div className="footer-section publisher-info">
                        <h4>Publisher</h4>
                        <div className="publisher-details">
                            <span className="publisher-name">Andrew Rollins</span>
                            <span className="publisher-email">andrew@web4guru.com</span>
                        </div>
                        <p className="publisher-note">Web4Guru</p>
                    </div>
                    <div className="footer-section advertise-section">
                        <h4>Advertise</h4>
                        <p>Join New England's most independent minds.</p>
                        <Link to="/submit" className="glowing-ad-btn">Start Advertising</Link>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About & Submissions</Link></li>
                            <li><Link to="/subscribe">Subscribe & Support</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Common Sense 250. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
