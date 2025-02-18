"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/paymentRoutes.js
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
// Replace with your Stripe secret key
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing in environment variables');
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        // Convert amount to cents if needed
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
