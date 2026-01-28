import React from 'react';

const About = () => {
    return (
        <main className="container about-page">
            <section className="about-section">
                <h2>What "Common Sense 250" Seeks</h2>
                <p>
                    We are dedicated to publishing pieces by thoughtful people about modern civics.
                    They can be about culture, business, or education, and can come from political candidates.
                </p>
                <p>
                    They can come from anyone age 12 and older who lives or lived in New England.
                    We especially welcome thoughtful pieces from still-in-school authors.
                </p>
                <div className="callout">
                    <p>
                        Libertarian and Conservative voices are welcome here. <span className="bold">Progressive-yet-sensible</span> (very difficult these days) is especially welcomed.
                        Authoritarian is <span className="bold">not</span> — send that to the NY Times or Pravda.
                    </p>
                </div>
            </section>

            <div className="two-col-grid">
                <section className="submission-section">
                    <h3>Submission Guidelines</h3>
                    <ul className="guidelines-list">
                        <li>Articles should be 1000 words or fewer.</li>
                        <li>Links to outside URLs are welcome so long as the URL is SHORT.</li>
                        <li>A short bio plus URL may accompany the submission.</li>
                        <li>Include 1-3 photos (1 will likely be chosen as a thumbnail).</li>
                        <li><strong>There is zero charge.</strong></li>
                    </ul>

                    <div className="contact-box">
                        <h4>Submit Articles To:</h4>
                        <p className="contact-name">Andrew Rollins</p>
                        <a href="mailto:andrew@web4guru.com" className="email-link">andrew@web4guru.com</a>
                    </div>
                </section>

                <section className="advertising-section">
                    <h3>Advertising & Sponsorships</h3>
                    <div className="rates-card">
                        <h4>Rates</h4>
                        <div className="rate-item">
                            <span className="rate-label">Per Issue</span>
                            <span className="rate-price">$35</span>
                        </div>
                        <div className="rate-item">
                            <span className="rate-label">One Month (4 issues)</span>
                            <span className="rate-price">$135</span>
                        </div>
                        <p className="rate-note">Monthly advertisers get an active link to the URL of their choosing.</p>
                        <p className="rate-note">Yearly advertisers (40 issues or more) become lead speakers at one of the three "Blue Moon Conferences" held each year on the <span className="bold">fifth Sunday of the month</span>.</p>
                    </div>

                    <div className="contact-box">
                        <h4>Contact for Ads:</h4>
                        <p className="contact-name">Mark Stewart Greenstein</p>
                        <a href="mailto:libertymsg@gmail.com" className="email-link">libertymsg@gmail.com</a>
                    </div>
                </section>
            </div>
            <section className="conferences-section">
                <span className="section-label">Events & Community</span>
                <h2>The Blue Moon Conferences</h2>
                <p>
                    Held each year on the fifth Sunday of a month, our Blue Moon Conferences are the gathering point
                    for New England's most independent minds. Yearly advertisers and patrons are invited to address
                    the assembly and lead the discussion on the future of our civics.
                </p>
                <div className="conference-meta">
                    <p>Coming in 2026: May 31 • August 30 • November 29</p>
                </div>
            </section>
        </main>
    );
};

export default About;
