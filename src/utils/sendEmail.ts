import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
    console.log("Preparing to send email to:", to);
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from : `Online Marketplace <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to ' + to);
        return {success : true}
    } catch (error : any) {
        console.error('Error sending email to ' + to, error);
        return {success : false, error : error.message};
    }
}