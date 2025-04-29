import { ServiceResponseType } from "../types/response.type";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.HOST_NODE_MAILER,
  auth: {
    user: process.env.USER_NODE_MAILER,
    pass: process.env.PASS_NODE_MAILER,
  },
  port: 587,
  secure: false,
});

export const sendEmail = async (
  email: string,
  subject: string,
  content: string
): Promise<ServiceResponseType> => {
  try {
    const result = await transporter.sendMail({
      from: process.env.USER_NODE_MAILER,
      to: email,
      subject,
      html: content,
    });

    if (result.rejected.length > 0) {
      return {
        success: false,
        status: 400,
        message: `Email rejected: ${result.rejected.join(", ")}`,
      };
    }

    return { success: true, status: 200 };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again later"
    );
  }
};
