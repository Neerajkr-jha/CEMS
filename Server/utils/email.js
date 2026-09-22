const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
})
// senfding email for booking confirmation
const sendBookingEmail= async (email, bookingDetails) => {
    try {
        const mailOptions = { 
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed ${eventTitle}`,  
            html:`<h2>Hi ${userName},</h2>
            <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
            <p>Thank you for booking with us!</p>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Booking email successfully sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending booking email:", error);
    }
};
// sending email for otp verification
const sendOtpEmail = async (userEmail, otp, type) => {
    try {
        const title = type === "account_verification" ? "Account Verification" : "Booking Confirmation";
        const msg = type === "account_verification" ? `Please use the following OTP to verify your account` : `Please use the following OTP to confirm your booking`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                      <h2 style="color: #111;">${title}</h2>
                      <p style="color: #555; font-size: 16px;">${msg}</p>
                      <div style="margin: 20px auto; padding: 15px;font-size: 24px; font-weight: bold; background-color: #f4f4f4; width: max-content;letter-spacing: 5px;">
                        ${otp}
                      </div>
                      <p style="color: #999; font-size: 12px;">This Code will expire in 5 minutes.if you did not request this, please ignore this email.</p>
                   </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
}

module.exports = { sendOtpEmail, sendBookingEmail };