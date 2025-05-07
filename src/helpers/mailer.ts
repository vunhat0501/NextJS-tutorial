import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export const sendEmail = async ({
    email,
    emailType,
    userId,
}: {
    email: string;
    emailType: string;
    userId: string;
}) => {
    try {
        // create hash token
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === 'verify') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000, // 1h
            });
        } else if (emailType === 'reset') {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000, // 1h
            });
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        // email link base on email type
        const link =
            emailType === 'verify'
                ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
                : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

        const mailOptions = {
            from: 'vunhat4869@gmail.com',
            to: email,
            subject:
                emailType === 'verify'
                    ? 'Verify your email'
                    : 'Reset your password',
            html: `
                <p>
                    Click <a href="${link}">here</a> 
                    to ${emailType === 'verify' ? 'verify your email' : 'reset your password'}.
                    Or copy and paste the link below into your browser.
                    <br>
                    ${link}
                </p>
            `,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse; // Return the response from the mail server
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
            throw new Error(error.message);
        }
    }
};
