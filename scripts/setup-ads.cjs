require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const path = require('path');

async function setupStripe() {
    console.log('Updating/Creating Stripe Products...');

    try {
        // 1-3. Subscriptions (Already created, but we can retrieve or re-create if needed)
        // For simplicity, we'll just add the new ones.

        // 4. Advertising - Per Issue ($35.00)
        const adIssueProduct = await stripe.products.create({
            name: 'Common Sense 250 - Advertising (Single Issue)',
            description: 'One advertisement in a single weekly edition.',
        });
        const adIssuePrice = await stripe.prices.create({
            unit_amount: 3500,
            currency: 'usd',
            product: adIssueProduct.id,
        });

        // 5. Advertising - One Month ($135.00)
        const adMonthProduct = await stripe.products.create({
            name: 'Common Sense 250 - Advertising (One Month)',
            description: 'Advertisement in four consecutive weekly editions + active URL link.',
        });
        const adMonthPrice = await stripe.prices.create({
            unit_amount: 13500,
            currency: 'usd',
            product: adMonthProduct.id,
        });

        // Load existing config to append
        const configPath = path.join(__dirname, '../src/data/stripe-config.json');
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        config.AD_SINGLE_ISSUE_PRICE_ID = adIssuePrice.id;
        config.AD_MONTHLY_PRICE_ID = adMonthPrice.id;

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        console.log('Success! Stripe Ad results:');
        console.log({
            AD_SINGLE_ISSUE_PRICE_ID: adIssuePrice.id,
            AD_MONTHLY_PRICE_ID: adMonthPrice.id
        });
    } catch (error) {
        console.error('Error setting up Stripe Ads:', error.message);
    }
}

setupStripe();
