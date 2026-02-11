import React, { useState } from 'react';
import { newspaperEditions } from '../data/newspaperContent';
import mastheadImg from '../assets/common_sense_masthead_final.jpg';
import ticonderogaImg from '../assets/ethan_allan_ticonderoga.png';
import railwayImg from '../assets/granite_railway_vintage.png';
import bellImg from '../assets/bell_telephone_vintage.png';
import mayeImg from '../assets/drake_maye_vintage_newsprint.png';
import './PrintEdition.css';

const PrintEdition = () => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isSleekMode, setIsSleekMode] = useState(false);
    const edition = newspaperEditions[0];
    const page = edition.pages[currentPageIndex];

    const nextPage = () => {
        if (currentPageIndex < edition.pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderItem = (item, index) => {
        switch (item.type) {
            case 'article':
                return (
                    <article key={index} className="news-article-expanded">
                        <h2 className="article-title">{item.title}</h2>
                        {item.subtitle && <span className="article-subtitle">{item.subtitle}</span>}
                        <div className="article-body">
                            {item.body.split('\n\n').map((p, i) => (
                                <p key={i}>{p.split('**').map((text, j) => (j % 2 === 1 ? <strong key={j}>{text}</strong> : text))}</p>
                            ))}
                        </div>
                    </article>
                );
            case 'timeline':
                return (
                    <section key={index} className="timeline-section">
                        <h3>{item.title}</h3>
                        {item.items.map((entry, i) => (
                            <div key={i} className="timeline-entry">
                                <span className="timeline-year">{entry.year}</span> — <strong>{entry.name}</strong> ({entry.location})
                                <p>{entry.text}</p>
                            </div>
                        ))}
                    </section>
                );
            case 'timeline-entry':
                return (
                    <div key={index} className="timeline-entry">
                        <span className="timeline-year">{item.year}</span> — <strong>{item.name}</strong> ({item.location})
                        <p>{item.text}</p>
                    </div>
                );
            case 'republication':
                return (
                    <div key={index} className="republication-container">
                        <div className="original-box">
                            <h3 className="section-label">ORIGINAL ARTICLE</h3>
                            <h4 className="article-title-small">{item.title}</h4>
                            <p className="article-preview">"{item.originalText}"</p>
                            <div className="author-sig">— {item.originalAuthor}</div>
                        </div>
                        <div className="reply-box">
                            <h3 className="section-label">PUBLIC REPLY</h3>
                            <p className="reply-text">{item.replyText}</p>
                            <div className="author-sig">— {item.replyAuthor}</div>
                        </div>
                        <p className="note italic">{item.note}</p>
                    </div>
                );
            case 'profile':
                return (
                    <div key={index} className="profile-card">
                        <h2 className="article-title">{item.name}</h2>
                        <p className="tagline bold lowercase uppercase">{item.tagline}</p>
                        <div className="priorities-list">
                            <h4>SIX KEY PRIORITIES:</h4>
                            <ul>
                                {item.priorities.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                        <div className="bio-footer" style={{ marginTop: '30px', borderTop: '1px solid #000', paddingTop: '20px' }}>
                            <p>{item.bio}</p>
                            <p className="contact bold">{item.contact}</p>
                        </div>
                    </div>
                );
            case 'skate-again':
                return (
                    <div key={index} className="skate-section">
                        <h2 className="article-title">{item.title}</h2>
                        <div className="skate-text bold italic" style={{ border: '4px solid #000', padding: '20px', textAlign: 'center' }}>
                            {item.text}
                        </div>
                    </div>
                );
            case 'ad':
                return (
                    <div key={index} className="ad-small">
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                    </div>
                );
            case 'ad-grid':
                return (
                    <div key={index} className="ad-grid">
                        {item.ads.map((ad, i) => (
                            <div key={i} className="ad-small">
                                <h4>{typeof ad === 'object' ? ad.name : ad}</h4>
                                <p>{typeof ad === 'object' ? ad.text : "Advertisement Support"}</p>
                                {ad.url && <p className="url">{ad.url}</p>}
                            </div>
                        ))}
                    </div>
                );
            case 'ad-large':
                return (
                    <div key={index} className="ad-full-width">
                        <h2>{item.name}</h2>
                        <p className="url">{item.url}</p>
                        <p>{item.text}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="paper-edition-container">
            <div className="newspaper-controls">
                <button className="nav-btn" onClick={prevPage} disabled={currentPageIndex === 0}>&larr; Prev Page</button>
                <span className="page-indicator">PAGE {page.number} / 8</span>
                <button className="nav-btn" onClick={nextPage} disabled={currentPageIndex === 7}>Next Page &rarr;</button>
                <div className="control-separator">|</div>
                <button
                    className="toggle-btn"
                    onClick={() => setIsSleekMode(!isSleekMode)}
                >
                    SWITCH TO {isSleekMode ? 'VINTAGE' : 'SLEEK'} MODE
                </button>
            </div>

            <div className={`newspaper-sheet ${isSleekMode ? 'sleek-mode' : 'vintage-mode'}`}>
                {page.number === 1 && !isSleekMode && (
                    <header className="newspaper-masthead">
                        <img src={mastheadImg} alt="Common Sense 250" className="masthead-img" />
                    </header>
                )}

                {isSleekMode && <h1 style={{ fontFamily: 'Playfair Display, serif', textAlign: 'center', marginBottom: '40px' }}>Common Sense 250</h1>}

                <div className="page-meta">
                    <span>{edition.date}</span>
                    <span>{page.type}</span>
                    <span>VOL. {edition.vol} — NO. {edition.no}</span>
                </div>

                <div className="page-content">
                    {page.number === 1 ? (
                        <div className="front-page-grid">
                            {renderItem(page.content[0], 0)}
                            <div className="illustration-box" style={{ margin: '40px auto', maxWidth: '80%' }}>
                                <img src={ticonderogaImg} alt="Fort Ticonderoga" />
                                <p className="caption">Ethan Allan & The Green Mountain Boys - Capture of Fort Ticonderoga</p>
                            </div>
                            {renderItem(page.content[1], 1)}
                        </div>
                    ) : (
                        <div className="standard-layout">
                            {page.content.map((item, i) => renderItem(item, i))}

                            {/* Contextual Images */}
                            {page.number === 4 && (
                                <div className="illustration-spacer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                                    <div className="illustration-box"><img src={bellImg} /><p className="caption">Bell's Telephone</p></div>
                                    <div className="illustration-box"><img src={railwayImg} /><p className="caption">Granite Railway, Mass.</p></div>
                                </div>
                            )}
                            {page.number === 8 && (
                                <div className="illustration-box" style={{ marginTop: '40px' }}>
                                    <img src={mayeImg} className="halftone" />
                                    <p className="caption">The Future of New England Sports: Drake Maye</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <footer className="page-footer-mini" style={{ marginTop: '60px', borderTop: '1px solid #000', textAlign: 'center', fontSize: '0.8rem', paddingTop: '10px' }}>
                    © 2026 COMMON SENSE 250 • PUBLISHED WEEKLY • WWW.COMMONSENSE250.COM
                </footer>
            </div>
        </main>
    );
};

export default PrintEdition;
