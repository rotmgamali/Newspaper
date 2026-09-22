import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import stripeConfig from '../data/stripe-config.json';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Subscribe = () => {
    const handleCheckout = async (priceId) => {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: priceId === stripeConfig.SINGLE_ISSUE_PRICE_ID ? 'payment' : 'subscription',
            successUrl: `${window.location.origin}/subscribe?success=true`,
            cancelUrl: `${window.location.origin}/subscribe`,
        });

        if (error) {
            console.error('Stripe Checkout Error:', error);
        }
    };

    return (
        <main className="container subscribe-page">
            <div className="subscribe-content">
                <div className="subscribe-header">
                    <h2>Subscribe to Common Sense 250</h2>
                    <p>Published by Web4Guru for Common Sense 250. Get the gold-standard in civics delivered to your door.</p>
                </div>

                <div className="subscription-plans">
                    <div className="plan-card">
                        <h3>Single Issue</h3>
                        <div className="price">$2.50</div>
                        <p>Pick up a copy at a participating Connecticut shop, or order a single edition.</p>
                        <button className="btn-subscribe" onClick={() => handleCheckout(stripeConfig.SINGLE_ISSUE_PRICE_ID)}>Buy Issue</button>
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
                        <button className="btn-subscribe" onClick={() => handleCheckout(stripeConfig.MONTHLY_SUBSCRIPTION_PRICE_ID)}>Subscribe Now</button>
                    </div>

                    <div className="plan-card">
                        <h3>Patriot Supporter</h3>
                        <div className="price">$100.00 <span className="period">/ year</span></div>
                        <p>A full year of the paper, and a standing invitation to speak at a Blue Moon Conference.</p>
                        <div className="plan-features">
                            <ul>
                                <li>All Monthly benefits</li>
                                <li>Lead Speaker at Conferences</li>
                                <li>Recognition in our annual list</li>
                            </ul>
                        </div>
                        <button className="btn-subscribe outline" onClick={() => handleCheckout(stripeConfig.PATRIOT_SUPPORTER_PRICE_ID)}>Become a Supporter</button>
                    </div>
                </div>

                <div className="subscribe-info">
                    <h3>Payment Information</h3>
                    <p>
                        All payments are processed securely via Stripe. Your subscription helps maintain the independence of this New England press.
                    </p>
                    <p className="publisher-credit">
                        Published by: <strong>Web4Guru for Common Sense 250</strong>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Subscribe;
