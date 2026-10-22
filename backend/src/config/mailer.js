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

// export const sendMail = async (to,subject,body) => {
//     console.log("I am going to send ");
//     try {
//         await transport.sendMail({
//         from: process.env.GMAIL_USER,
//         to,
//         subject,
//         html: body 
//     });
//     } catch (error) {
//         console.log(error);
//     }
// }

import 'dotenv/config';

export const sendMail = async (to, subject, body) => {
  console.log('I am going to send');
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: process.env.GMAIL_USER, name: 'Your App' },
      to: [{ email: to }],
      subject,
      htmlContent: body,
    }),
  });

  if (!res.ok) {
    throw new Error(`Brevo API ${res.status}: ${await res.text()}`);
  }
  return res.json();
};