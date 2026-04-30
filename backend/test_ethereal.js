import sendEmail from './utils/sendEmail.js';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        await sendEmail({
            email: 'test@example.com',
            subject: 'Test Subject',
            html: '<h1>Test Ethereal</h1>'
        });
        console.log("Finished sending test email");
    } catch (err) {
        console.error("Error sending test email:", err);
    }
};

test();
