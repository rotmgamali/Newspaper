import React from 'react';
import { Link } from 'react-router-dom';

const Submit = () => {
    return (
        <main className="container submit-page">
            <div className="page-header">
                <span className="section-label">Contribute & Partner</span>
                <h2>The Common Sense Platform</h2>
                <p className="subtitle">A space for New Englanders to speak, and for partners to be seen.</p>
            </div>

            <div className="submit-grid">
                {/* Left Column: Mission & Guidelines */}
                <section className="submission-mission">
                    <div className="info-block">
                        <h3>Our Mission</h3>
                        <p>
                            Common Sense 250 is more than a newspaper; it is a civic forum. We believe that the renewal of our region
                            begins with open, honest, and local discourse. Whether you are a student, a business owner, or a retiree,
                            if you have a perspective on the future of New England, we want to hear it.
                        </p>
                    </div>

                    <div className="info-block">
                        <h3>Editorial Guidelines</h3>
                        <ul className="guidelines-list">
                            <li><strong>Who:</strong> Residents (active or former) of ME, NH, VT, CT, or MA, age 12+.</li>
                            <li><strong>What:</strong> Articles (1000 words max) or Dialogue Replies (300 words max).</li>
                            <li><strong>Style:</strong> We value clarity, respect, and evidence. </li>
                            <li><strong>Format:</strong> Submit text in the body of an email or as a .doc/.pdf attachment.</li>
                            <li><strong>Photos:</strong> Include 1-3 high-quality images. We use 1" square thumbnails in print.</li>
                        </ul>
                    </div>
                </section>

                {/* Right Column: Submission Actions */}
                <section className="submission-actions">
                    <div className="action-card submit-box">
                        <span className="card-icon">✍️</span>
                        <h3>Submit an Article</h3>
                        <p>Send your draft to our editorial desk for review. No cost to publish.</p>
                        <div className="contact-person">
                            <strong className="contact-name">Andrew Rollins</strong>
                            <a href="mailto:andrew@web4guru.com" className="email-link">andrew@web4guru.com</a>
                        </div>
                    </div>

                    <div className="action-card subscribe-promo">
                        <h3>Support the Press</h3>
                        <p>Independent journalism requires community support. Subscribe to the Gold Paper today.</p>
                        <Link to="/subscribe" className="gold-link">Subscription Plans &rarr;</Link>
                    </div>
                </section>
            </div>

            {/* Full Width Bottom: Advertisers Section */}
            <section className="advertisers-portal">
                <div className="portal-header">
                    <span className="line"></span>
                    <h2>Advertisers & Partners</h2>
                    <span className="line"></span>
                </div>

                <div className="advertiser-grid">
                    <div className="ad-info">
                        <h3>Why Advertise with Us?</h3>
                        <p>
                            Your message will appear on our premium <strong>Gold-Tinted Bond</strong> weekly print edition,
                            distributed to the most engaged civic minds across New England.
                        </p>
                        <div className="ad-rates">
                            <div className="rate-row">
                                <span>Single Issue Placement</span>
                                <strong>$35</strong>
                            </div>
                            <div className="rate-row">
                                <span>Monthly (4 Consecutive Issues)</span>
                                <strong>$135</strong>
                            </div>
                        </div>
                        <p className="note">Monthly partners receive a direct link to their URL in our digital archive.</p>
                    </div>

                    <div className="ad-benefits">
                        <h3>Patriot & Yearly Partners</h3>
                        <p>
                            Yearly advertisers (40+ issues) receive the highest level of community recognition:
                        </p>
                        <ul>
                            <li><strong>Blue Moon Conferences:</strong> Guaranteed lead speaker invitation.</li>
                            <li><strong>Annual Registry:</strong> Profiled in our "Patriot Partners" year-end edition.</li>
                            <li><strong>Personalized URL:</strong> Managed link for tracking engagement.</li>
                        </ul>
                        <div className="contact-person">
                            <strong>Mark Stewart Greenstein</strong>
                            <p className="note">Advertising & Sponsorships</p>
                            <a href="mailto:libertymsg@gmail.com" className="email-link">libertymsg@gmail.com</a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Submit;
