import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { campaigns } from '../data/campaigns';

const CampaignDetail = () => {
    const { id } = useParams();
    const candidate = campaigns.find(c => c.id === id);

    if (!candidate) {
        return (
            <main className="container error-page">
                <h2>Candidate Not Found</h2>
                <p>We couldn't find the campaign details you're looking for.</p>
                <Link to="/campaigns" className="gold-link">&larr; Back to Campaign Corner</Link>
            </main>
        );
    }

    return (
        <main className="container campaign-detail-page">
            <div className="campaign-hero">
                <div className="candidate-intro">
                    <span className="state-label">{candidate.state}</span>
                    <h2>{candidate.name}</h2>
                    <span className="office-title-detail">{candidate.office}</span>
                    <span className="party-label">{candidate.party}</span>
                </div>

                <div className="real-time-status-card">
                    <div className="status-header">
                        <span className="pulse-dot"></span>
                        <span className="status-title">REAL-TIME TRACKING</span>
                    </div>
                    <div className="status-content">
                        <p className="status-text">{candidate.realTimeStatus}</p>
                        <p className="latest-announcement"><strong>Latest:</strong> {candidate.latestUpdate}</p>
                    </div>
                </div>
            </div>

            <div className="campaign-content-grid">
                <section className="candidate-bio-section">
                    <h3>Biography</h3>
                    <p>{candidate.bio}</p>

                    <div className="platform-list-box">
                        <h3>Key Platform Points</h3>
                        <ul className="platform-points">
                            {candidate.platform.map((point, idx) => (
                                <li key={idx}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                <aside className="campaign-sidebar">
                    <div className="campaign-info-box">
                        <h4>Campaign Info</h4>
                        <div className="info-item">
                            <span>Status:</span>
                            <span className="status-badge-detail">{candidate.status}</span>
                        </div>
                        <div className="info-item">
                            <span>Election Year:</span>
                            <span>2026</span>
                        </div>
                    </div>

                    <div className="support-box">
                        <h4>Support Local Press</h4>
                        <p>We provide fair coverage for all candidates. Help us keep it that way.</p>
                        <Link to="/subscribe" className="gold-link">Subscribe Now &rarr;</Link>
                    </div>
                </aside>
            </div>

            <div className="page-footer-nav">
                <Link to="/campaigns" className="gold-link">&larr; Back to All Campaigns</Link>
            </div>
        </main>
    );
};

export default CampaignDetail;
