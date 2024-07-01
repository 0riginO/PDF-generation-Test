import nodemailer from "nodemailer";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "deon@fullsuite.ph",
    pass: process.env.SMTP_PASS,
  },
});

async function sendPdfs(pdfs) {
  try {
    for (const pdf of pdfs) {
      const { recipient, fullName, companyName, datePayout, filePath } = pdf;
      const info = await transporter.sendMail({
        from: "deon@fullsuite.ph",
        to: recipient,
        subject: `Payslip for ${fullName}`,
        text: `${companyName}: Payslip for ${datePayout} payout. The Password is your Employee ID and Hire Date in YYYY-MM-DD format.`,
        attachments: [
          {
            filename: `Payslip - ${fullName}.pdf`,
            path: filePath,
            contentType: "application/pdf",
          },
        ],
      });

      if (info.messageId) {
        console.log("Email has been sent.");
        fs.rmSync(filePath); // Delete PDF file after sending
      } else {
        console.log("Something went wrong sending email.");
      }
    }
    return true;
  } catch (error) {
    throw new Error("Error sending emails - " + error.message);
  }
}

export default sendPdfs;
