import dotenv from 'dotenv'
dotenv.config({
    path : './.env'
});
import mailer from 'nodemailer';

const transport = mailer.createTransport({
    service:"gmail",
    auth :{
        user : process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
})

export const sendMail = async (to,subject,body) => {
    console.log("Mail is going to send");
    await transport.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html: body  // or `text:` for plain text
});
}


console.log("GMAIL_USER present:", !!process.env.GMAIL_USER);
console.log("GMAIL_APP_PASSWORD present:", !!process.env.GMAIL_APP_PASSWORD);

transport.verify((err, success) => {
    if (err) {
        console.error("Transporter verify failed:", err);
    } else {
        console.log("Transporter is ready to send emails");
    }
});