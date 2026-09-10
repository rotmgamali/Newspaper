import React from 'react';
import { Link } from 'react-router-dom';
import { campaigns } from '../data/campaigns';

const Campaigns = () => {
    const states = [...new Set(campaigns.map(c => c.state))];

    return (
        <main className="container campaigns-page">
            <div className="page-header">
                <span className="section-label">Candidate Directory</span>
                <h2>New England Candidates, 2026</h2>
                <p className="subtitle">Office sought, party, and platform for state and local candidates across the region.</p>
                <p className="directory-note">These profiles are a static reference compiled for the 2026 cycle and are not live updates.</p>
            </div>

            <div className="campaign-grid enhanced-grid">
                {states.map((state, idx) => (
                    <section key={idx} className="state-section">
                        <h3 className="state-name-header">{state}</h3>
                        <div className="candidate-list grid-view">
                            {campaigns.filter(c => c.state === state).map(candidate => (
                                <Link to={`/campaign/${candidate.id}`} key={candidate.id} className="candidate-card-link">
                                    <div className="enhanced-candidate-card">
                                        <div className="card-top">
                                            <h4>{candidate.name}</h4>
                                            <span className="office-tag">{candidate.office}</span>
                                        </div>

                                        <div className="card-bottom">
                                            <p className="candidate-party-line">{candidate.party} &middot; {candidate.status}</p>
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
