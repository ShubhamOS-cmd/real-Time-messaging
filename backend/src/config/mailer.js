import dotenv from 'dotenv';
dotenv.config();
import mailer from 'nodemailer';

const transport = mailer.createTransport({
    
    host:process.env.BREVO_SMTP_HOST,
    port:Number(process.env.BREVO_SMTP_PORT),
    secure:false,
    auth :{
        user : process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
})

export const sendMail = async (to,subject,body) => {
    console.log("I am going to send ");
    await transport.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html: body 
});
}