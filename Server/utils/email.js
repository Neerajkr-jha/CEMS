const nodemailer = require("nodemailer");
require("dotenv").config();
const { Resend } = require("resend");

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     pool: true,
//     maxConnections: 3,
//     maxMessages: 100,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

const resendClient = new Resend(process.env.RESEND_API_KEY);

const BRAND = {
    name: "Gatherr",
    dark: "#09090f",
    purple: "#6c63ff",
    background: "#f4f5fb",
    text: "#171725",
    muted: "#6b7280",
};

// Shared HTML layout
const emailLayout = (content, preheader = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};
             font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">

    <div style="display:none;font-size:1px;color:${BRAND.background};
                line-height:1px;max-height:0;max-width:0;opacity:0;
                overflow:hidden;">
        ${preheader}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
           border="0" style="background:${BRAND.background};">
        <tr>
            <td align="center" style="padding:32px 12px;">

                <table role="presentation" width="100%" cellspacing="0"
                       cellpadding="0" border="0"
                       style="max-width:560px;background:#ffffff;
                              border-radius:18px;overflow:hidden;">

                    <tr>
                        <td style="background:${BRAND.dark};padding:28px 32px;">
                            <div style="font-size:27px;font-weight:800;
                                        letter-spacing:-1px;color:#ffffff;">
                                Gatherr<span style="color:${BRAND.purple};">.</span>
                            </div>
                            <div style="font-size:12px;color:#c4c4d4;
                                        margin-top:6px;letter-spacing:1.5px;">
                                MAKE MOMENTS HAPPEN
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:36px 32px 32px;">
                            ${content}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:22px 32px;background:#fafaff;
                                   border-top:1px solid #eeeef5;
                                   text-align:center;">
                            <p style="margin:0;color:${BRAND.muted};
                                      font-size:12px;line-height:1.8;">
                                Made for moments worth gathering for.<br>
                                You're receiving this email because you used Gatherr.
                            </p>
                            <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">
                                &copy; ${new Date().getFullYear()} Gatherr. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</body>
</html>
`;

// Escape dynamic values before inserting them into HTML
const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[char]);

// OTP verification email
const sendOtpEmail = async (userEmail, otp, type) => {
    const isAccountVerification = type === "account_verification";

    const title = isAccountVerification
        ? "Verify your email"
        : "Confirm your booking";

    const description = isAccountVerification
        ? "Use the verification code below to finish setting up your Gatherr account."
        : "Enter this code to verify your booking request on Gatherr.";

    const content = `
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;
                  color:${BRAND.purple};text-transform:uppercase;
                  letter-spacing:1.5px;">
            ${isAccountVerification ? "ACCOUNT SECURITY" : "BOOKING VERIFICATION"}
        </p>

        <h1 style="margin:0 0 16px;font-size:29px;line-height:1.25;
                   letter-spacing:-0.8px;color:${BRAND.dark};">
            ${title}
        </h1>

        <p style="margin:0 0 26px;font-size:15px;line-height:1.8;
                  color:${BRAND.muted};">
            Hi there,<br>${description}
        </p>

        <div style="background:#f5f4ff;border:1px solid #e6e3ff;
                    border-radius:14px;padding:24px 12px;text-align:center;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;
                      color:${BRAND.muted};letter-spacing:2px;">
                YOUR VERIFICATION CODE
            </p>
            <div style="font-size:34px;font-weight:800;letter-spacing:9px;
                        color:${BRAND.dark};">
                ${escapeHtml(otp)}
            </div>
        </div>

        <p style="margin:22px 0 0;font-size:13px;line-height:1.8;
                  color:${BRAND.muted};">
            This code expires in <strong>5 minutes</strong>. Never share it
            with anyone. If you didn't request this code, you can safely
            ignore this email.
        </p>
    `;

    try {
        const { data, error } = await resendClient.emails.send({
            from: `"Gatherr" <${process.env.EMAIL_USER}>`,
            to: [userEmail],
            subject: `${title} | Gatherr`,
            html: emailLayout(
                content,
                `${title} — your Gatherr verification code.`
            ),
            text: `${title}\n\n${description}\nYour OTP is: ${otp}\nIt expires in 5 minutes.`,
        });

        if (error) {
            console.error("Resend OTP email error:", error);
            throw new Error(error.message || "Failed to send OTP email");
        }

        console.log("OTP email accepted by Resend:", data?.id);
        return true;

    } catch (error) {
        console.error("OTP email error:", error.message);
        throw error;
    }
};

// Booking confirmation email
const sendBookingEmail = async (email, bookingDetails) => {
    const {
        userName,
        eventTitle,
        amount,
        bookingId,
    } = bookingDetails;

    //html and css content for the email
    const content = `
        <div style="display:inline-block;background:#e9f9ef;color:#187443;
                    padding:7px 12px;border-radius:20px;font-size:12px;
                    font-weight:700;">
            &#10003; BOOKING CONFIRMED
        </div>

        <h1 style="margin:22px 0 12px;font-size:29px;line-height:1.25;
                   letter-spacing:-0.8px;color:${BRAND.dark};">
            You're on the list!
        </h1>

        <p style="margin:0 0 26px;font-size:15px;line-height:1.8;
                  color:${BRAND.muted};">
            Hi ${escapeHtml(userName || "there")}, your booking for
            <strong style="color:${BRAND.dark};">
                ${escapeHtml(eventTitle || "your event")}
            </strong>
            has been confirmed. Get ready to make some great memories.
        </p>

        <div style="border:1px solid #e9e9f2;border-radius:14px;
                    padding:22px;background:#fcfcff;">
            <p style="margin:0 0 18px;font-size:12px;font-weight:700;
                      color:${BRAND.purple};letter-spacing:1.5px;">
                BOOKING SUMMARY
            </p>

            <p style="margin:0 0 8px;font-size:12px;color:${BRAND.muted};">
                EVENT
            </p>
            <p style="margin:0 0 20px;font-size:17px;font-weight:700;
                      color:${BRAND.dark};">
                ${escapeHtml(eventTitle || "Your event")}
            </p>

            ${bookingId ? `
                <p style="margin:0 0 8px;font-size:12px;color:${BRAND.muted};">
                    BOOKING REFERENCE
                </p>
                <p style="margin:0 0 20px;font-size:13px;font-weight:600;
                          color:${BRAND.dark};word-break:break-all;">
                    ${escapeHtml(bookingId)}
                </p>
            ` : ""}

            ${amount !== undefined && amount !== null ? `
                <div style="border-top:1px solid #e9e9f2;padding-top:16px;">
                    <span style="font-size:13px;color:${BRAND.muted};">
                        Ticket amount
                    </span>
                    <span style="float:right;font-size:17px;font-weight:800;
                                 color:${BRAND.dark};">
                        &#8377;${escapeHtml(amount)}
                    </span>
                </div>
            ` : ""}
        </div>

        <p style="margin:24px 0 0;font-size:14px;line-height:1.8;
                  color:${BRAND.muted};">
            Keep this email for your records. Check your Gatherr dashboard
            for the latest booking and payment status.
        </p>
    `;


    try {
        const { data, error } = await resendClient.emails.send({
            from: `"Gatherr" <${process.env.EMAIL_USER}>`,
            to: [email],
            subject: `Booking Confirmed: ${eventTitle} | Gatherr`,
            html: emailLayout(
                content,
                `Your booking for ${eventTitle} is confirmed.`
            ),
            text: `Hi ${userName || "there"}, your booking for ${eventTitle} is confirmed.${bookingId ? ` Booking reference: ${bookingId}.` : ""}${amount != null ? ` Ticket amount: ₹${amount}.` : ""}`,
        });

        if (error) {
            console.error("Resend booking email error:", error);
            throw new Error(error.message || "Failed to send booking email");
        }

        console.log("Booking email accepted by Resend:", data?.id);
        return true;

    } catch (error) {
        console.error("Booking email error:", error.message);
        throw error;
    }

};

module.exports = {
    sendOtpEmail,
    sendBookingEmail,
};
