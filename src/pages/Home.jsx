import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const TimelineItem = ({ year, person, location, content }) => (
    <div className="timeline-card">
        <span className="timeline-year">{year}</span>
        <h3>{person}</h3>
        <span className="timeline-location">{location}</span>
        <p>{content}</p>
    </div>
);

const Home = () => {
    const featured = articles[0];
    const latest = articles.slice(1, 4);

    return (
        <main className="container magazine-layout">
            <div className="hero-grid">
                <div className="featured-hero">
                    <span className="section-label">Featured Opinion</span>
                    <Link to={`/article/${featured.id}`}>
                        <img src={featured.image} alt={featured.title} className="hero-img" />
                        <h2>{featured.title}</h2>
                    </Link>
                    <div className="byline">By {featured.author}</div>
                    <p className="excerpt">{featured.excerpt}</p>
                    <Link to={`/article/${featured.id}`} className="read-more-link">Read Full Article &rarr;</Link>
                </div>

                <div className="latest-sidebar">
                    <span className="sidebar-label">Latest & Noteworthy</span>
                    {latest.map(article => (
                        <div key={article.id} className="sidebar-item">
                            <span className="category">{article.category}</span>
                            <h4><Link to={`/article/${article.id}`}>{article.title}</Link></h4>
                            <p>{article.excerpt.slice(0, 80)}...</p>
                        </div>
                    ))}
                    <div className="sidebar-cta">
                        <Link to="/articles" className="gold-link">Browse Archive &rarr;</Link>
                    </div>
                </div>
            </div>

            <section className="history-grid-section">
                <div className="section-header">
                    <span className="horizontal-rule"></span>
                    <h2 className="section-title">Admirable New Englanders — Every 50 Years</h2>
                    <span className="horizontal-rule"></span>
                </div>

                <div className="history-grid">
                    <TimelineItem
                        year="1775-76"
                        person="Ethan Allan"
                        location="Connecticut"
                        content="Leads a group of 40 militiamen to invade British held Fort Ticonderoga, capturing defenders without firing a shot."
                    />
                    <TimelineItem
                        year="1826"
                        person="Gridley Bryant"
                        location="Massachusetts"
                        content="Constructed The Granite Railway, the first commercial line built for business purposes."
                    />
                    <TimelineItem
                        year="1875-76"
                        person="Alexander Graham Bell"
                        location="Massachusetts"
                        content="Working with Elisha Gray, Bell invents and then patents the telephone."
                    />
                </div>
            </section>

            <div className="bottom-grid">
                <section className="civic-dialogue-home">
                    <div className="section-header">
                        <h2 className="section-title">The Civic Dialogue</h2>
                    </div>
                    <div className="dialogue-card">
                        <div className="original-mini">
                            <span className="label">Original:</span>
                            <h4>The Responsibility of Citizenship</h4>
                        </div>
                        <div className="reply-arrow-mini">↓</div>
                        <div className="public-reply-mini">
                            <span className="label">Public Reply:</span>
                            <blockquote className="italic">
                                "While I agree with the core sentiment, we must consider the modern barriers..."
                            </blockquote>
                            <span className="reply-author">— J. Rollins, Manchester, NH</span>
                        </div>
                        <p className="republication-note-mini">Republished later this week with reply.</p>
                    </div>
                </section>

                <section className="conference-preview">
                    <div className="section-header">
                        <h2 className="section-title">Blue Moon Conferences</h2>
                    </div>
                    <div className="conference-card">
                        <p className="date">Next Event: May 31, 2026</p>
                        <p className="description">Gathering point for New England's most independent minds.</p>
                        <Link to="/about" className="gold-link">Details & Registration &rarr;</Link>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Home;
