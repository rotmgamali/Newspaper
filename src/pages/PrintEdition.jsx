import React, { useState } from 'react';
import { newspaperEditions } from '../data/newspaperContent';
import mastheadImg from '../assets/common_sense_masthead_old_style_v2.png'; // Note: User needs to move generated assets to assets folder or use direct path
import ticonderogaImg from '../assets/ethan_allan_ticonderoga.png';
import railwayImg from '../assets/granite_railway_vintage.png';
import bellImg from '../assets/bell_telephone_vintage.png';
import mayeImg from '../assets/drake_maye_vintage_newsprint.png';
import './PrintEdition.css';

const PrintEdition = () => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const edition = newspaperEditions[0];
    const page = edition.pages[currentPageIndex];

    const nextPage = () => {
        if (currentPageIndex < edition.pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const renderContent = (item, index) => {
        switch (item.type) {
            case 'article':
                return (
                    <article key={index} className="news-article">
                        <h2 className="article-title">{item.title}</h2>
                        {item.subtitle && <p className="article-subtitle">{item.subtitle}</p>}
                        <div className="article-meta">By {item.author}</div>
                        <div className="article-body">
                            {item.body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
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
                    <div key={index} className="timeline-entry single-entry">
                        <span className="timeline-year">{item.year}</span> — <strong>{item.name}</strong> ({item.location})
                        <p>{item.text}</p>
                    </div>
                );
            case 'ad-grid':
                return (
                    <div key={index} className="ad-grid">
                        {item.ads.map((ad, i) => (
                            <div key={i} className="ad-card">
                                <h3>ADVERTISEMENT</h3>
                                <p>{ad}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'profile':
                return (
                    <section key={index} className="candidate-profile">
                        <h2 className="article-title">{item.name}</h2>
                        <p className="article-subtitle">{item.party} — {item.role}</p>
                        <div className="profile-bio">
                            <p>{item.bio}</p>
                        </div>
                        <div className="priorities-list">
                            <h4>KEY PRIORITIES:</h4>
                            <ul>
                                {item.priorities.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    </section>
                );
            case 'ad-large':
                return (
                    <div key={index} className="ad-large">
                        <h2>{item.name}</h2>
                        <p className="url">{item.url}</p>
                        <p className="text">{item.text}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="paper-edition-container">
            <div className="page-navigation">
                <button className="nav-btn" onClick={prevPage} disabled={currentPageIndex === 0}>&larr; Previous Page</button>
                <span>Page {page.number} of {edition.pages.length}</span>
                <button className="nav-btn" onClick={nextPage} disabled={currentPageIndex === edition.pages.length - 1}>Next Page &rarr;</button>
            </div>

            <div className={`newspaper-sheet page-${page.number}`}>
                {page.number === 1 && (
                    <header className="newspaper-masthead">
                        <img src={mastheadImg} alt="Common Sense 250" />
                    </header>
                )}

                <div className="page-meta">
                    <span>{edition.date}</span>
                    <span>{page.type}</span>
                    <span>Vol. {edition.vol}, No. {edition.no} — Page {page.number}</span>
                </div>

                <div className="page-content">
                    {page.number === 1 ? (
                        <div className="content-columns">
                            <div className="main-column">
                                {renderContent(page.content[0], 0)}
                                <div className="illustration-box">
                                    <img src={ticonderogaImg} alt="Fort Ticonderoga" />
                                    <p className="caption">The Capture of Fort Ticonderoga, May 10, 1775</p>
                                </div>
                            </div>
                            <div className="side-column">
                                {renderContent(page.content[1], 1)}
                                {renderContent(page.content[2], 2)}
                            </div>
                        </div>
                    ) : (
                        <div className="standard-page-layout">
                            {page.content.map((item, i) => renderContent(item, i))}
                            {page.number === 4 && (
                                <div className="illustration-box">
                                    <img src={mayeImg} alt="Drake Maye" />
                                    <p className="caption">Drake Maye leads the Patriots rebound.</p>
                                </div>
                            )}
                            {page.number === 5 && (
                                <div className="illustration-box">
                                    <img src={bellImg} alt="Alexander Graham Bell" />
                                    <p className="caption">Bell's Telephone Experiment, 1876</p>
                                </div>
                            )}
                            {page.number === 6 && (
                                <div className="illustration-box">
                                    <img src={railwayImg} alt="Granite Railway" />
                                    <p className="caption">The Granite Railway, Quincy, Mass.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="print-instruction">
                <p>Press <strong>Cmd+P</strong> (Mac) or <strong>Ctrl+P</strong> (Windows) to print this page.</p>
            </div>
        </main>
    );
};

export default PrintEdition;
