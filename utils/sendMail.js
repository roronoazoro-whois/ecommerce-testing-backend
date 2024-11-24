const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    try {
        // Kiểm tra các biến môi trường cần thiết
        if (!process.env.SMPT_HOST || !process.env.SMPT_PORT || !process.env.SMPT_SERVICE || !process.env.SMPT_MAIL || !process.env.SMPT_PASSWORD) {
            throw new Error("Thiếu thông tin cấu hình SMTP trong file .env");
        }

        // Tạo transporter với cấu hình SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            secure: process.env.SMPT_PORT == 465, // Sử dụng TLS nếu cổng là 465
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
        });

        // Tạo thông tin email
        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

module.exports = sendMail;
