import React from 'react';
import { useSearchParams } from 'react-router-dom';
import stripeConfig from '../data/stripe-config.json';

// Stripe Payment Links, one per tier. Each collects a US mailing address,
// because every tier is a paper that goes in the post.
//
// Until 30 September 2026 these were client-side Checkout calls. That API was
// removed from stripe.js and the live build never carried a publishable key,
// so all three buttons did nothing while this page said payments went through
// Stripe. The subscription button also pointed at a $10-a-MONTH price under a
// "$10 / quarter" label. Links need no key and no backend, and each one is
// bound to exactly the price printed beside it.
const links = stripeConfig.PAYMENT_LINKS;

const Subscribe = () => {
    const [params] = useSearchParams();
    const paid = params.get('success') === 'true';

    return (
        <main className="container subscribe-page">
            <div className="subscribe-content">
                <div className="subscribe-header">
                    <h2>Subscribe to Common Sense 250</h2>
                    <p>Get the gold-standard in civics delivered to your door.</p>
                </div>

                {paid && (
                    <div className="subscribe-success" role="status">
                        <strong>Thank you — you're in.</strong> A receipt is on its way to your
                        email, and your copy will be mailed to the address you gave as it prints.
                    </div>
                )}

                <div className="subscription-plans">
                    <div className="plan-card">
                        <h3>Single Issue</h3>
                        <div className="price">$2.50</div>
                        <p>Pick up a copy at a participating Connecticut shop, or order a single edition.</p>
                        <a className="btn-subscribe" href={links.SINGLE_ISSUE}>Buy Issue</a>
                    </div>

                    <div className="plan-card featured">
                        <h3>Subscription</h3>
                        <div className="price">$10.00 <span className="period">/ quarter</span></div>
                        <p>Every issue mailed to your New England address as it prints.</p>
                        <div className="plan-features">
                            <ul>
                                <li>Each quarterly edition mailed to you</li>
                                <li>Digital archive access</li>
                                <li>Support independent journalism</li>
                            </ul>
                        </div>
                        <a className="btn-subscribe" href={links.QUARTERLY}>Subscribe Now</a>
                    </div>

                    <div className="plan-card">
                        <h3>Patriot Supporter</h3>
                        <div className="price">$100.00 <span className="period">/ year</span></div>
                        <p>A full year of the paper, and a standing invitation to speak at a Blue Moon Conference.</p>
                        <div className="plan-features">
                            <ul>
                                <li>Everything in the subscription</li>
                                <li>Lead Speaker at Conferences</li>
                                <li>Recognition in our annual list</li>
                            </ul>
                        </div>
                        <a className="btn-subscribe outline" href={links.PATRIOT_SUPPORTER}>Become a Supporter</a>
                    </div>
                </div>

                <div className="subscribe-info">
                    <h3>Payment Information</h3>
                    <p>
                        Payments are processed securely by Stripe. Web4Guru produces the paper
                        and handles its payments, so your card statement will read WEB4GURU.
                        Your subscription helps maintain the independence of this New England press.
                    </p>
                    <p className="publisher-credit">
                        Published by <strong>Mark Stewart Greenstein</strong> · Produced by Web4Guru
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Subscribe;
