import sendEmail from './utils/sendEmail.js';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        console.log("Using EMAIL_USER:", process.env.EMAIL_USER);
        await sendEmail({
            email: process.env.EMAIL_USER, // Send to themselves
            subject: 'Test Gmail Routing',
            html: '<h1>If you see this, Gmail routing works!</h1>'
        });
        console.log("Finished sending real test email");
    } catch (err) {
        console.error("Error sending real test email:", err);
    }
};

test();
