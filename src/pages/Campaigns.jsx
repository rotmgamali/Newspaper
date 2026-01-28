import React from 'react';
import { Link } from 'react-router-dom';
import { campaigns } from '../data/campaigns';

const Campaigns = () => {
    const states = [...new Set(campaigns.map(c => c.state))];

    return (
        <main className="container campaigns-page">
            <div className="page-header">
                <span className="section-label">Live Election Tracking</span>
                <h2>Campaign Corner 2026</h2>
                <p className="subtitle">Real-time status updates for New England's state and local candidates.</p>
            </div>

            <div className="campaign-grid enhanced-grid">
                {states.map((state, idx) => (
                    <section key={idx} className="state-section">
                        <h3 className="state-name-header">{state}</h3>
                        <div className="candidate-list grid-view">
                            {campaigns.filter(c => c.state === state).map(candidate => (
                                <Link to={`/campaign/${candidate.id}`} key={candidate.id} className="candidate-card-link">
                                    <div className="enhanced-candidate-card">
                                        <div className="live-status-ribbon">
                                            <span className="pulse-dot-live"></span>
                                            LIVE STATUS
                                        </div>

                                        <div className="card-top">
                                            <h4>{candidate.name}</h4>
                                            <span className="office-tag">{candidate.office}</span>
                                        </div>

                                        <div className="real-time-snippet">
                                            <p className="snippet-text">"{candidate.realTimeStatus}"</p>
                                            <p className="update-timestamp">Updated: Just Now</p>
                                        </div>

                                        <div className="card-bottom">
                                            <p className="latest-note-small"><strong>Latest:</strong> {candidate.latestUpdate}</p>
                                            <span className="expand-label">Read Platform &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <div className="campaign-notice-banner">
                <div className="banner-content">
                    <h3>Are you running for office?</h3>
                    <p>Common Sense 250 provides free, open space for all New England candidates to speak directly to the public.</p>
                </div>
                <Link to="/submit" className="btn-action-gold">Submit Your Platform</Link>
            </div>
        </main>
    );
};

export default Campaigns;
