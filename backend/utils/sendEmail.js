import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    let transporter;

    // If you have real email credentials in .env, it uses them
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // Otherwise, it creates a fake testing email account automatically!
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log("⚠️ No EMAIL_USER found in .env! Using a fake testing email account.");
    }

    const mailOptions = {
        from: `Fitness Tracker <${process.env.EMAIL_USER || 'system@fitnesstracker.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    
    // If using the fake testing account, print the link to view the email
    if (!process.env.EMAIL_USER) {
        console.log("=============================================");
        console.log("📩 TEST EMAIL SENT SUCCESSFULLY!");
        console.log("👉 CLICK HERE TO VIEW IT: %s", nodemailer.getTestMessageUrl(info));
        console.log("=============================================");
    }
};

export default sendEmail;
