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

    const getPhotoSrc = (photoName) => {
        const photos = {
            'ticonderoga': ticonderogaImg,
            'railway': railwayImg,
            'bell': bellImg,
            'maye': mayeImg
        };
        return photos[photoName] || null;
    };

    const renderItem = (item, index) => {
        switch (item.type) {
            case 'article':
                return (
                    <div key={index} className={`article-container ${item.photoSize === 'hero' ? 'large-feature' : ''}`}>
                        <h2 className="article-title">{item.title}</h2>
                        {item.subtitle && <span className="article-subtitle">{item.subtitle}</span>}
                        {item.photo && item.photoSize === 'hero' && (
                            <div className="photo-box photo-hero">
                                <img src={getPhotoSrc(item.photo)} alt={item.title} />
                                {item.photoCaption && <p className="photo-caption">{item.photoCaption}</p>}
                            </div>
                        )}
                        <div className="article-body drop-cap">
                            {item.photo && item.photoSize === 'side' && (
                                <div className="photo-box photo-side">
                                    <img src={getPhotoSrc(item.photo)} alt={item.title} />
                                    {item.photoCaption && <p className="photo-caption">{item.photoCaption}</p>}
                                </div>
                            )}
                            {item.body.split('\n\n').map((p, i) => (
                                <p key={i}>{p.split('**').map((text, j) => (j % 2 === 1 ? <strong key={j}>{text}</strong> : text))}</p>
                            ))}
                        </div>
                    </div>
                );
            case 'snippet-box':
                return (
                    <div key={index} className="snippet-box">
                        <h4>{item.title}</h4>
                        {item.items.map((it, i) => (
                            <div key={i} className="snippet-item">{it}</div>
                        ))}
                    </div>
                );
            case 'quote':
                return (
                    <div key={index} className="quote-block">
                        <span className="quote-text">“{item.text}”</span>
                        <span className="quote-source">— {item.source}</span>
                    </div>
                );
            case 'timeline':
                return (
                    <div key={index} className="timeline-container">
                        <h3 className="section-header">{item.title}</h3>
                        {item.items.map((entry, i) => (
                            <div key={i} className="timeline-entry">
                                <span className="timeline-year">{entry.year}</span> — <strong>{entry.name}</strong>
                                <p>{entry.text}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'republication':
                return (
                    <div key={index} className="republication-layout">
                        <div className="original-article">
                            <h3 className="tag">ORIGINAL</h3>
                            <h4>{item.title}</h4>
                            <p>"{item.originalText}"</p>
                            <span className="sig">— {item.originalAuthor}</span>
                        </div>
                        <div className="public-reply">
                            <h3 className="tag">THE REPLY</h3>
                            <p>{item.replyText}</p>
                            <span className="sig">— {item.replyAuthor}</span>
                        </div>
                        <p className="editor-note">{item.note}</p>
                    </div>
                );
            case 'profile':
                return (
                    <div key={index} className="candidate-profile-view">
                        <h2 className="article-title">{item.name}</h2>
                        <h4 className="candidate-tagline">{item.tagline}</h4>
                        <div className="priority-grid">
                            {item.priorities.map((p, i) => (
                                <div key={i} className="priority-item">• {p}</div>
                            ))}
                        </div>
                        <div className="candidate-bio">
                            <p>{item.bio}</p>
                            <p className="contact-info"><strong>Contact:</strong> {item.contact}</p>
                        </div>
                    </div>
                );
            case 'skate-again':
                return (
                    <div key={index} className="skate-feature">
                        <h2 className="article-title">{item.title}</h2>
                        <div className="skate-text">{item.text}</div>
                        {item.photo && (
                            <div className="photo-box photo-side">
                                <img src={getPhotoSrc(item.photo)} alt="Whale" />
                                {item.photoCaption && <p className="photo-caption">{item.photoCaption}</p>}
                            </div>
                        )}
                    </div>
                );
            case 'ad-large':
                return (
                    <div key={index} className="ad-ribbon">
                        <h2>{item.name}</h2>
                        <p>{item.text}</p>
                        {item.url && <span className="url">{item.url}</span>}
                    </div>
                );
            case 'ad-small':
            case 'ad':
                return (
                    <div key={index} className="ad-vintage">
                        <h4>{item.name || item.title}</h4>
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
                <button className="nav-btn" onClick={prevPage} disabled={currentPageIndex === 0}>PREVIOUS</button>
                <span className="page-label">PAGE {page.number} / 8</span>
                <button className="nav-btn" onClick={nextPage} disabled={currentPageIndex === 7}>NEXT</button>
                <div className="v-divider"></div>
                <button onClick={() => setIsSleekMode(!isSleekMode)} className="mode-btn">
                    {isSleekMode ? 'VINTAGE' : 'SLEEK'}
                </button>
            </div>

            <div className={`newspaper-sheet ${isSleekMode ? 'sleek' : 'vintage'}`}>
                {page.number === 1 && (
                    <header className="masthead">
                        <img src={mastheadImg} alt="Common Sense 250" className="masthead-img" />
                    </header>
                )}

                <div className="page-meta">
                    <span>{edition.date}</span>
                    <span>{page.type}</span>
                    <span>EST. 2026</span>
                </div>

                <div className={`page-content ${page.gridType || ''}`}>
                    {page.content.map((item, i) => renderItem(item, i))}
                </div>

                <footer className="sheet-footer">
                    <span>© Common Sense 250 Newspaper</span>
                    <span>Digital Edition Reproduced by Web4Guru</span>
                </footer>
            </div>
        </main>
    );
};

export default PrintEdition;
