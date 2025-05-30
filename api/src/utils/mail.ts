import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ENVOI,
        pass: process.env.PASSWORD_ENVOI
    }
});

export default transporter;