import mailer from 'nodemailer';

const transport = mailer.createTransport({
    service:"gmail",
    auth :{
        user : "alphacenturi6@gmail.com",
        pass: "hrzlcifhamcqpcni"
    }
})

export const sendMail = async (to,subject,body) => {
    await transport.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html: body  // or `text:` for plain text
});
}
