import nodemailer from 'nodemailer'
import GENERATEMAIL from '../../useCase/interface/generateMail';


class GenerateEmail implements GENERATEMAIL {

    sendEmail(email: string,otp: number): void {
        
        const mailData=`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>One-Time Password (OTP)</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align: center;">One-Time Password (OTP) for Verification</h2>
            <p>Dear User,</p>
            <p>Your one-time password (OTP) for verification is:</p>
            <h1 style="text-align: center; font-size: 36px; padding: 20px; background-color: #f2f2f2; border-radius: 5px;">${otp}</h1>
            <p>Please use this OTP to complete your verification process.</p>
            <p>This OTP is valid for a single use and will expire after a short period of time.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Thank you,</p>
            <p>GymHub</p>
        </body>
        </html>
        
        `;

        let mailTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_USER,
                pass:process.env.NODEMAILER_PASS
            }
        })

        let details={
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: 'One-Time Password (GymHub) for Verification',
            html:mailData
        }

        mailTransporter.sendMail(details,(err)=>{
            if(err){
                return 
            }
        })


    }
    sendGymAcceptEmail(email: string): void {
        
         
        const mailData=`
        <!DOCTYPE html>
<html>
<head>
    <title>Gym Acceptance Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 0.8em;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Gym Acceptance Notification</h1>
        </div>
        <div class="content">
            <p>Dear Gym Owner,</p>
            <p>We are pleased to inform you that your gym has been successfully accepted by our admin team. You can now log in and manage your gym details through our website.</p>
            <p>To get started, please follow the link below to log in:</p>
            <a href="https://yourwebsite.com/login" style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Log In</a>
            <p>Once logged in, you can edit your gym details, view bookings, and manage your gym's schedule. If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
        </div>
        <div class="footer">
            <p>Thank you for choosing our platform. We're here to help!</p>
        </div>
    </div>
</body>
</html>

        
        `;

        let mailTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_USER,
                pass:process.env.NODEMAILER_PASS
            }
        })

        let details={
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: 'Gym Acceptance Notification (GymHub)',
            html:mailData
        }

        mailTransporter.sendMail(details,(err)=>{
            if(err){
                return 
            }
        })

    }
    sendGymRejectEmail(email: string,reason: string): void {
        
        const mailData=`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Gym Rejection Notification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 5px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .content {
                    margin-bottom: 20px;
                }
                .footer {
                    text-align: center;
                    font-size: 0.8em;
                    color: #6c757d;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Gym Rejection Notification</h1>
                </div>
                <div class="content">
                    <p>Dear Gym Owner,</p>
                    <p>We regret to inform you that your gym application has been reviewed and was not accepted by our admin team. We understand this may be disappointing, and we appreciate your interest in our platform.</p>
                    <p>The reason for the rejection is as follows:</p>
                    <blockquote>
                    ${reason}
                    </blockquote>
                    <p>We encourage you to review the feedback and consider any necessary adjustments to your application. If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
                </div>
                <div class="footer">
                    <p>Thank you for your interest in our platform. We're here to help!</p>
                </div>
            </div>
        </body>
        </html>
        
        
        `;

        let mailTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_USER,
                pass:process.env.NODEMAILER_PASS
            }
        })

        let details={
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: 'Gym Rejection Notification (GymHub)',
            html:mailData
        }

        mailTransporter.sendMail(details,(err)=>{
            if(err){
                return 
            }
        })

    }


    sendSubscription(email: string, gymName: string,subscriptionType: string,
        date: string, expiryDate: string, price: number, qrCode: string) {
        try {
            const mailData = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Subscripion Booking Details</title>
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="text-align: center;">Subscription Booking Details</h2>
                <p>Dear User,</p>
                <p>Your subscription booking details for "${gymName}" are:</p>
                <div style="padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                    <p><strong>Gym:</strong> ${gymName}</p>
                    <p><strong>Subscription Type:</strong> ${subscriptionType}</p> 
                    <p><strong>Joining Date:</strong> ${date}</p>
                    <p><strong>Expiry Date:</strong> ${expiryDate}</p>
                    <p><strong>Price:</strong> ₹${price}</p>
                </div>
                <p>Please find your QR code below:</p>
                <img src="cid:unique_qr_code_cid" alt="QR Code" style="display: block; margin: 0 auto; padding: 20px; max-width: 200px;">
                <p>Scan this QR code at the gym for entry.</p>
                <p>If you have any questions or concerns, feel free to contact us.</p>
                <p>Thank you for booking with us!</p>
                <p>Gym Hub,</p>
            </body>
            </html>
    `;


            let mailTransporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user:process.env.NODEMAILER_USER,
                    pass:process.env.NODEMAILER_PASS
                }
            });

            let details = {
                from: process.env.NODEMAILER_USER,
                to: email,
                subject: "Subscription Booking Success",
                html: mailData,
                attachments: [
                    {
                        filename: 'qr_code.png',
                        content: qrCode.split(';base64,').pop(), 
                        encoding: 'base64',
                        cid: 'unique_qr_code_cid' // CID used in the email HTML img src
                    }
                ]
            };
            mailTransporter.sendMail(details, (err) => {
                if (err) {
                    return 
                }
                return true;
            });
        } catch (error) {
            
        }
    }
}


export default GenerateEmail