const emailHeader = () => `
  <div style="background-color: rgb(0, 0, 0); padding: 10px;">
    <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td style="vertical-align: middle;">
          <a href="${process.env.JOBLIENCES_FRONT_END_URL}">
            <img src="${process.env.SEND_EMAIL_IMAGE}" alt="Jobliences" style="max-width: 120px; display: block;" />
          </a>
        </td>
        <td style="vertical-align: middle; padding-left: 10px;">
          <div style="color: white; font-size: 24px; font-weight: bold;">
            Jobliences
          </div>
        </td>
      </tr>
    </table>
  </div>
`;

const emailFooter = () => `
  <div style="width: 100%; margin-top: 30px; font-size: 12px; color: gray; text-align: center;">
    <p>Jobliences 2025 ©</p>
    <p>Jobliences is a registered trademark of Jobliences.</p>
    <p style="margin-top: 10px;">
      <strong>Follow us on: </strong>
      <a href="${process.env.JOBLIENCES_FACEBOOK_URL}" style="margin: 0 5px;">
        <img src="https://cdn-icons-png.flaticon.com/24/174/174848.png" alt="Facebook" style="width: 16px; vertical-align: middle;" />
      </a>
      <a href="${process.env.JOBLIENCES_INSTAGRAM_URL}" style="margin: 0 5px;">
        <img src="https://cdn-icons-png.flaticon.com/24/174/174855.png" alt="Instagram" style="width: 16px; vertical-align: middle;" />
      </a>
      <a href="${process.env.JOBLIENCES_TWITTER_URL}" style="margin: 0 5px;">
        <img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Twitter" style="width: 16px; vertical-align: middle;" />
      </a>
    </p>
  </div>
`;

//#region Auth
export const sendVerifyEmail = (link: string, userName: string) => `
  ${emailHeader()}
  <p style="margin-top: 30px;">Hello, ${userName}</p>

  <p>Hey there from Jobliences!</p>
  <p>Thanks a bunch for signing up — we’re excited to have you with us.</p>
  <p>Just one last step: please confirm your email address below.</p>

  <div style="text-align: center;">
    <a href="${link}" style="
      display: inline-block;
      background-color: #038922;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      margin: 20px auto;
      border-radius: 4px;
      font-weight: bold;
    ">
      Validate email address
    </a>
  </div>

  <p>Do you want to know more about us? Follow our crazy adventures on Facebook, Twitter or Instagram!</p>
  <p>Don't hesitate to contact us if you have questions, suggestions or simply give us any feedback.</p>
  <p>Have a wonderful day,</p>
  ${emailFooter()}
`;

export const resetEmail = (link: string, email: string) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; direction: ltr; padding: 20px; text-align: left;">
    ${emailHeader()}
    <p style="margin-top: 30px;">Hi <strong>${email}</strong>,</p>
    <p>We received a request to reset your password.</p>
    <p>You can reset it by clicking the button below:</p>

    <div style="text-align: center;">
      <a href="${link}" style="
        display: inline-block;
        background-color: #038922;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        margin: 20px auto;
        border-radius: 4px;
        font-weight: bold;
      ">
        Reset Password
      </a>
    </div>

    <p>If you didn’t request a password reset, you can safely ignore this message.</p>
    <p>Best regards,<br />Jobliences</p>
    ${emailFooter()}
  </div>
`;
//#endRegion

//#region Company

export const sendMemberEmail = (memberName: string) => `
  ${emailHeader()}
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #0073e6;">Welcome to Jobliences, ${memberName}!</h2>
    <p>Thank you for your interest in joining a company on <strong>Jobliences</strong>.</p>
    <p>Your request to join the company has been received and is currently under review by the company's administrators.</p>
    <p>We kindly ask for your patience during this process. You will receive a confirmation email once a decision has been made.</p>
    <p>If you have any questions in the meantime, feel free to reach out to us.</p>
    <p>Best regards,<br/>The Jobliences Team</p>
  </div>
  ${emailFooter()}
`;

export const sendCompanyEmail = (feedBackLink: string, companyName: string) => `
  ${emailHeader()}
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #0073e6;">Hi ${companyName}, thanks for joining Jobliences!</h2>
    <p>We're excited to inform you that we’ve received your request to create a company profile on <strong>Jobliences</strong>.</p>
    <p>Our team is currently reviewing the details of your request. We’ll notify you once a decision has been made.</p>
    <p>This usually takes between <strong>2 to 7 working days</strong>, so please bear with us while we process your submission.</p>
    <p>In the meantime, you can easily track the status of your request by following the link below:</p>
    <div style="text-align: center;">
      <a href="${feedBackLink}" style="
        display: inline-block;
        background-color: #038922;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        margin: 20px auto;
        border-radius: 4px;
        font-weight: bold;
      ">
        Track Your Request
      </a>
    </div>
    <p>If you have any questions or need assistance, feel free to reach out to us. We’re here to help!</p>
    <p>Warm regards,<br/>The Jobliences Team</p>
  </div>
  ${emailFooter()}
`;
export const sendCompanyStatusMessage = (
  companyName: string,
  status: "approved" | "rejected" | "pending"
) => {
  switch (status) {
    case "approved":
      return `
        Great news! Your company "${companyName}" has been approved 🎉
        We're happy to inform you that your request to create a company on Jobliences has been successfully reviewed and approved.
        You can now fully access and manage your company profile, post opportunities, and connect with top talents.
        To get started, simply log in to your dashboard and explore the available tools.
        If you have any questions, feel free to reach out — we’re always here to support you.
        Welcome aboard!
        The Jobliences Team
      `;

    case "rejected":
      return `
        We're sorry! Your company "${companyName}" has been rejected.
        We regret to inform you that your request to create a company on Jobliences has not been approved.
        Unfortunately, after reviewing the details, we are unable to proceed with your company's registration at this time.
        If you have any questions or would like feedback on the decision, feel free to reach out to us. We’re happy to assist you in any way we can.
        Thank you for your understanding.
        The Jobliences Team
      `;

    case "pending":
      return `
        Your company "${companyName}" is currently pending review.
        Thank you for your interest in creating a company on Jobliences.
        Your request has been received and is currently under review. We will notify you once the review process is completed and a decision has been made.
        In the meantime, feel free to reach out to us if you have any questions or need further assistance.
        We appreciate your patience.
        The Jobliences Team
      `;
    default:
      return "";
  }
};
//#endRegion

//#region job
export const sendInterviewEmail = (
  interviewLink: string,
  applicantName: string
) => `
  ${emailHeader()}
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #0073e6;">Dear ${applicantName},</h2>
    <p>We are excited to inform you that you have been selected for an interview as part of your application process on <strong>Jobliences</strong>.</p>
    <p>This is a great opportunity to showcase your skills and learn more about the company you applied to.</p>
    <p>To view the interview details and schedule, please click the button below:</p>
    <div style="margin: 20px 0; text-align: center;">
      <a href="${interviewLink}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
        View Interview Details
      </a>
    </div>
    <p>We wish you the best of luck!</p>
    <p>Best regards,<br/>The Jobliences Team</p>
  </div>
  ${emailFooter()}
`;
//#endregion
