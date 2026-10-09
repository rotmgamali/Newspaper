import React from 'react';

/**
 * commonsense250.news/join — the short link printed in the starred box on page
 * 1 of the October 2026 issue. Wording is the publisher's own (2026-10-09):
 * the bYoB line from his page 1 box and the "For Students" copy from page 3.
 */
const page = { maxWidth: '44rem', margin: '0 auto', padding: '2.5rem 1rem 3rem', lineHeight: 1.6, fontSize: '1.1rem' };
const label = { display: 'block', textTransform: 'uppercase', letterSpacing: '.2em', fontSize: '.8rem', marginBottom: '.4rem' };
const callout = { borderLeft: '3px solid currentColor', padding: '.2rem 0 .2rem 1rem', margin: '1.2rem 0', fontStyle: 'italic', fontSize: '1.2rem' };
const contact = { border: '1px solid currentColor', padding: '1rem 1.2rem', margin: '1.5rem 0' };

const Join = () => {
    return (
        <main className="container about-page" style={page}>
            <section className="about-section">
                <span className="section-label" style={label}>For Students</span>
                <h2 style={{ fontSize: '2.2rem', margin: '0 0 .5rem' }}>Join Common Sense 250</h2>
                <div className="callout" style={callout}>
                    <p>
                        Old + new Media Managed by the <span className="bold">YOUNGER</span> or
                        the <span className="bold">BETTER</span> (bYoB). Hear here!
                    </p>
                </div>
                <p style={{ margin: '0 0 1rem' }}>
                    Join CS250. Spread the word. Your words, other influential people's words.
                </p>
                <p style={{ margin: '0 0 1rem' }}>
                    Internships, paid and volunteer, are now offered in media, marketing,
                    finance, sales &amp; “influence”.
                </p>
                <p>
                    CS250 staff collaborate each Friday evening. Join us!
                </p>
                <div className="contact-box" style={contact}>
                    <h4>Email Us:</h4>
                    <a href="mailto:andrew@web4guru.com" className="email-link">andrew@web4guru.com</a>
                </div>
                <p>
                    Want to write for the paper instead? See <a href="/about">what Common Sense 250 seeks</a>.
                </p>
            </section>
        </main>
    );
};

export default Join;
