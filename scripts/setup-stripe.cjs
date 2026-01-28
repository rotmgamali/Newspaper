require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const path = require('path');

async function setupStripe() {
    console.log('Creating Stripe Products...');

    try {
        // 1. Single Issue ($2.50)
        const singleProduct = await stripe.products.create({
            name: 'Common Sense 250 - Single Issue',
            description: 'One copy of the current weekly edition.',
        });
        const singlePrice = await stripe.prices.create({
            unit_amount: 250,
            currency: 'usd',
            product: singleProduct.id,
        });

        // 2. Monthly Subscription ($10.00)
        const monthlyProduct = await stripe.products.create({
            name: 'Common Sense 250 - Monthly (4 Issues)',
            description: 'Weekly delivery for one month.',
        });
        const monthlyPrice = await stripe.prices.create({
            unit_amount: 1000,
            currency: 'usd',
            recurring: { interval: 'month' },
            product: monthlyProduct.id,
        });

        // 3. Patriot Supporter ($100.00)
        const patriotProduct = await stripe.products.create({
            name: 'Common Sense 250 - Patriot Supporter',
            description: 'Full year subscription + lead speaker invitation to Blue Moon Conferences.',
        });
        const patriotPrice = await stripe.prices.create({
            unit_amount: 10000,
            currency: 'usd',
            recurring: { interval: 'year' },
            product: patriotProduct.id,
        });

        const config = {
            SINGLE_ISSUE_PRICE_ID: singlePrice.id,
            MONTHLY_SUBSCRIPTION_PRICE_ID: monthlyPrice.id,
            PATRIOT_SUPPORTER_PRICE_ID: patriotPrice.id,
        };

        const configPath = path.join(__dirname, '../src/data/stripe-config.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        console.log('Success! Stripe results:');
        console.log(config);
        console.log('Configuration saved to:', configPath);
    } catch (error) {
        console.error('Error setting up Stripe:', error.message);
    }
}

setupStripe();
