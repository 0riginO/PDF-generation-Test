import nodemailer from "nodemailer";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

async function sendPdfs(pdfs) {
  try {
    for (const pdf of pdfs) {
      const {
        recipient,
        fullName,
        companyName,
        dateFrom,
        dateTo,
        datePayout,
        filePath,
      } = pdf;
      const info = await transporter.sendMail({
        from: "deon@fullsuite.ph",
        to: recipient,
        subject: `Payslip for ${fullName} for the duration from ${dateFrom} to ${dateTo}.`,
        text: `${companyName}: Payslip for ${datePayout} payout. The Password is your Employee ID and Hire Date in YYYY-MM-DD format.`,
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en">

          <head></head>
                              
          <body bgcolor="#F5F8FA" style="width: 100%; margin: auto 0; padding:0; font-family:Lato, sans-serif; font-size:14px; color:#33475B; word-break:break-word">
                              
            <div id="email" style="margin: auto;width: 100%;background-color: white;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 0px 0px 0px 0px;">
                <tr>
                  <td style="vertical-align: top;">
                    <p>
                      Hi,
                      <br /><br />
                      Attached is your payslip for the period covering from ${dateFrom}, to ${dateTo}. This has been approved for credit to your respective account on ${datePayout}.
                      <br /><br />
                      To open the attachment, please use a password consisting of your Employee ID and your Hire Date in the format YYYY-MM-DD.
                      <br /><br />
                      Example:
                      <br />
                      If your hire date is January 15, 2020 (2020-01-15) and your Employee ID is ABCD-1234, your password will be ABCD-12342020-01-15.
                      <br /><br />
                      If you have any questions or issues regarding your payroll or payslip, please get in touch with the payroll accountant. 
                      <br />
                      (Please do not reply to this email.)
                    </p>
                  </td> 
                </tr>
              </table>
            </div>
          </body>
        </html>
        `,
        attachments: [
          {
            filename: `Payslip - ${fullName}.pdf`,
            path: filePath,
            contentType: "application/pdf",
          },
        ],
      });

      if (info.messageId) {
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
