import nodemailer from "nodemailer";
import fs from "fs";

function sendPdfs(pdfs) {
  return new Promise((resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "adrian@fullsuite.ph",
          pass: process.env.SMTP_PASS,
        },
      });
      pdfs.forEach((pdf, index) => {
        transporter.sendMail(
          {
            from: "adrian@fullsuite.ph",
            to: pdf.recipient,
            subject: `Payslip for ${pdf.fullName}`,
            text: `${pdf.companyName} payslip - ${index}`,
            attachments: [
              {
                filename: `payslip.pdf`,
                path: pdf.filePath,
                contentType: "application/pdf",
              },
            ],
          },
          (err, res) => {
            if (err) throw new Error("Something went wrong - " + err);
            res.messageId
              ? fs.rmSync(pdf.filePath)
              : console.log("Semething went wrong");
          }
        );
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}

export default sendPdfs;
