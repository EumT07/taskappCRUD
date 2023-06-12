import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
        host: process.env.hostMailtrap,
        port: process.env.portMailtrap,
        auth: {
          user: process.env.userMail,
          pass: process.env.userPass
        }
});

export const sendMail = async (userEmail,subjectText,htmlContent) => {
    const info = await transporter.sendMail({
        from: "taskappsupport@gamil.com",
        to: userEmail,
        subject: subjectText,
        html: htmlContent
    });

    console.log("Message sent: %s", info.messageId);
    return;
}

export const sendErrorMail = async (htmlContent) => {
  const info = await transporter.sendMail({
      from: "'AppError' <taskappsupport@gamil.com>",
      to: "taskappsupport@gamil.com",
      subject: "TaskApp-Error",
      html: htmlContent
  });

  console.log("Message sent: %s", info.messageId);
  return;
}

export const notificationAppMail = async (htmlContent) => {
  const info = await transporter.sendMail({
      from: "'New Status' <taskappsupport@gamil.com>",
      to: "taskappsupport@gamil.com",
      subject: "taskApp Notification",
      html: htmlContent
  });

  console.log("Message sent: %s", info.messageId);
  return;
}
