import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';
import './Print.css';

const Print = () => {
    const featured = articles[0]; // Protect Girls Sports

    return (
        <main className="container print-preview-page">
            <div className="page-header">
                <span className="section-label">The Gold Paper</span>
                <h2>Weekly Print Edition</h2>
                <p className="subtitle">Published every Saturday on 100% gold-tinted paper.</p>
            </div>

            <div className="print-layout-preview">
                <div className="paper-stack">
                    <div className="paper-sheet page-1">
                        <div className="masthead-mini">COMMON SENSE 250</div>
                        <div className="headline-mini">{featured.title.toUpperCase()}</div>
                        <div className="column-text">
                            {featured.content.substring(0, 400)}...
                            <br />
                            <Link to={`/article/${featured.id}`} className="print-article-link">Read Full Article &rarr;</Link>
                        </div>
                    </div>
                    <div className="paper-sheet page-2">
                        <div className="headline-mini">CIVIC DIALOGUE</div>
                        <div className="column-text">
                            Our community thrives on the exchange of ideas. In this week's print edition, we feature three public replies to last week's lead editorial.
                            <br />
                            <Link to="/articles" className="print-article-link">Browse Dialogue &rarr;</Link>
                        </div>
                    </div>
                </div>

                <div className="print-specs">
                    <h3>Print Specifications</h3>
                    <ul>
                        <li><strong>Frequency:</strong> Weekly (every Saturday morning)</li>
                        <li><strong>Format:</strong> 8-page compact broadsheet</li>
                        <li><strong>Stock:</strong> Premium Gold-Tinted 70lb Bond</li>
                        <li><strong>Distribution:</strong> Maine, NH, VT, CT, and MA</li>
                    </ul>
                    <div className="cta-block">
                        <p>Want it delivered?</p>
                        <Link to="/subscribe" className="btn-subscribe">Get Subscription Details</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Print;
