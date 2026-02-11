import React, { useState } from 'react';
import { newspaperEditions } from '../data/newspaperContent';
import mastheadImg from '../assets/common_sense_masthead_old_style_v2.png';
import ticonderogaImg from '../assets/ethan_allan_ticonderoga.png';
import railwayImg from '../assets/granite_railway_vintage.png';
import bellImg from '../assets/bell_telephone_vintage.png';
import mayeImg from '../assets/drake_maye_vintage_newsprint.png';
import girlsTrackImg from '../assets/girls_track.png';
import axeTaxImg from '../assets/axe_tax.png';
import classroomImg from '../assets/classroom.png';
import townHallImg from '../assets/town_hall.png';
import './PrintEdition.css';

const getPhoto = (name) => {
    const map = {
        'ticonderoga': ticonderogaImg,
        'railway': railwayImg,
        'bell': bellImg,
        'maye': mayeImg,
        'girls_track': girlsTrackImg,
        'axe_tax': axeTaxImg,
        'classroom': classroomImg,
        'town_hall': townHallImg
    };
    return map[name];
};

const StandardArticle = ({ data }) => (
    <article className="std-article">
        <h2 className="headline">{data.title}</h2>
        {data.subtitle && <h3 className="sub-headline">{data.subtitle}</h3>}
        {data.photo && (
            <figure className="article-photo">
                <img src={getPhoto(data.photo)} alt={data.title} />
                <figcaption>{data.caption}</figcaption>
            </figure>
        )}
        <div className="article-content">
            {data.body.split('\n\n').map((p, i) => (
                <p key={i}>{p.split('**').map((t, j) => j % 2 === 1 ? <strong key={j}>{t}</strong> : t)}</p>
            ))}
        </div>
        <div className="article-byline">— {data.author}</div>
    </article>
);

const Snippet = ({ title, text }) => (
    <div className="snippet-box">
        <h4>{title}</h4>
        <p>{text}</p>
    </div>
);

const FrontPage = ({ content }) => (
    <div className="layout-front-page">
        <header className="page-masthead">
            <img src={mastheadImg} alt="Common Sense 250" />
        </header>
        <div className="main-story">
            <StandardArticle data={content.mainArticle} />
        </div>
        <aside className="sidebar">
            <div className="snippet-box">
                <h4>{content.sidebar.listTitle}</h4>
                <ul>
                    {content.sidebar.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
            </div>
            <div className="quote-box">
                <p>"{content.quote.text}"</p>
                <span>— {content.quote.source}</span>
            </div>
            <div className="ad-box small">
                <img src={getPhoto('town_hall')} alt="Town Hall" style={{ width: '100%', sepia: '100%' }} />
                <p style={{ marginTop: '5px', fontSize: '0.8rem' }}><strong>Town Hall Meeting</strong><br />Tuesday, 7PM</p>
            </div>
        </aside>
    </div>
);

const ArticlePage = ({ content, side }) => (
    <div className={`layout-article ${side}`}>
        <div className="primary-col">
            <StandardArticle data={content.article} />
        </div>
        <div className="secondary-col">
            {content.ad && (
                <div className="ad-box vintage">
                    {content.ad.image ? (
                        <div className="visual-ad">
                            <img src={getPhoto(content.ad.image)} alt={content.ad.title} style={{ width: '100%' }} />
                            <h4>{content.ad.title}</h4>
                            <p>{content.ad.text}</p>
                        </div>
                    ) : (
                        <>
                            <h4>{content.ad.title}</h4>
                            <p>{content.ad.text}</p>
                        </>
                    )}
                </div>
            )}
            {content.snippet && <Snippet title={content.snippet.title} text={content.snippet.text} />}
            {content.quote && (
                <div className="quote-box small">
                    <p>"{content.quote.text}"</p>
                    <span>— {content.quote.source}</span>
                </div>
            )}
        </div>
    </div>
);

const HistoryPage = ({ content }) => (
    <div className="layout-history">
        <h2 className="section-header">{content.title}</h2>
        <div className="timeline-grid">
            {content.timelineItems.map((item, i) => (
                <div key={i} className="timeline-item">
                    <span className="year">{item.year}</span>
                    <div className="info">
                        <strong>{item.name}</strong>
                        <p>{item.text}</p>
                        {item.image && <img src={getPhoto(item.image)} alt={item.name} style={{ width: '100px', float: 'right', marginLeft: '10px' }} />}
                    </div>
                </div>
            ))}
        </div>
        {content.sidebar && (
            <div className="snippet-box wide" style={{ marginTop: '20px' }}>
                <h4>{content.sidebar.title}</h4>
                <p>{content.sidebar.text}</p>
            </div>
        )}
        <div className="bottom-ad-ribbon">
            <h4>{content.ad.name}</h4>
            <p>{content.ad.text}</p>
        </div>
    </div>
);

const DialoguePage = ({ content }) => (
    <div className="layout-dialogue">
        <div className="republication-section">
            <h2 className="section-label">CIVIC DIALOGUE</h2>
            <div className="dialogue-split">
                <div className="original">
                    <h3>ORIGINAL</h3>
                    <h4>{content.republication.title}</h4>
                    <p>"{content.republication.original.text}"</p>
                    <span className="sig">— {content.republication.original.author}</span>
                </div>
                <div className="reply">
                    <h3>REPLY</h3>
                    <p>"{content.republication.reply.text}"</p>
                    <span className="sig">— {content.republication.reply.author}</span>
                </div>
            </div>
            <p className="note">{content.republication.note}</p>
        </div>
        <div className="letters-section">
            <h4>{content.letters.title}</h4>
            <div className="letters-grid">
                {content.letters.items.map((l, i) => <p key={i} className="letter">{l}</p>)}
            </div>
        </div>
    </div>
);

const ProfilePage = ({ content }) => (
    <div className="layout-profile">
        <div className="profile-header">
            <h2>{content.profile.name}</h2>
            <h3>{content.profile.tagline}</h3>
        </div>
        <div className="profile-body">
            <div className="priorities-list">
                <h4>KEY PRIORITIES</h4>
                <ul>{content.profile.priorities.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div className="bio-block">
                <p>{content.profile.bio}</p>
                <div className="contact-box">{content.profile.contact}</div>
                {content.profile.qa && (
                    <div className="qa-section">
                        <h4>Q & A</h4>
                        {content.profile.qa.map((qa, i) => (
                            <div key={i} className="qa-item">
                                <strong>Q: {qa.q}</strong>
                                <p>A: {qa.a}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="ad-box-corner">
            {content.ad.image && <img src={getPhoto(content.ad.image)} alt={content.ad.name} style={{ width: '100%', marginBottom: '10px' }} />}
            <h4>{content.ad.name}</h4>
            <p>{content.ad.text}</p>
        </div>
    </div>
);

const BackPage = ({ content }) => (
    <div className="layout-back">
        <div className="feature-block">
            <StandardArticle data={content.feature} />
        </div>
        {content.trivia && <Snippet title={content.trivia.title} text={content.trivia.text} />}
        <div className="ads-block">
            {content.ads.map((ad, i) => (
                <div key={i} className={`ad-box ${ad.size}`}>
                    <h4>{ad.name}</h4>
                    <p>{ad.text}</p>
                    {ad.url && <small>{ad.url}</small>}
                </div>
            ))}
        </div>
    </div>
);

const PrintEdition = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [sleekMode, setSleekMode] = useState(false);
    const page = newspaperEditions[0].pages[pageIndex];

    const renderLayout = () => {
        switch (page.layoutId) {
            case 'front-page': return <FrontPage content={page.content} />;
            case 'opinion-left': return <ArticlePage content={page.content} side="left" />;
            case 'opinion-right': return <ArticlePage content={page.content} side="right" />;
            case 'history-full': return <HistoryPage content={page.content} />;
            case 'article-standard': return <ArticlePage content={page.content} side="left" />;
            case 'dialogue-spread': return <DialoguePage content={page.content} />;
            case 'profile-full': return <ProfilePage content={page.content} />;
            case 'back-page': return <BackPage content={page.content} />;
            default: return <div>Unknown Layout</div>;
        }
    };

    return (
        <div className={`print-app-container ${sleekMode ? 'sleek' : 'vintage'}`}>
            <nav className="edition-controls">
                <button disabled={pageIndex === 0} onClick={() => setPageIndex(p => p - 1)}>Prev</button>
                <span>PAGE {page.number} of 8</span>
                <button disabled={pageIndex === 7} onClick={() => setPageIndex(p => p + 1)}>Next</button>
                <button className="mode-toggle" onClick={() => setSleekMode(!sleekMode)}>
                    {sleekMode ? 'Switch to Vintage' : 'Switch to Sleek'}
                </button>
            </nav>
            <main className="newspaper-sheet">
                <div className="sheet-meta">
                    <span>Vol 1, No 1</span>
                    <span>{newspaperEditions[0].date}</span>
                    <span>Common Sense 250</span>
                </div>
                {renderLayout()}
                <footer className="sheet-footer">{pageIndex + 1}</footer>
            </main>
        </div>
    );
};

export default PrintEdition;
