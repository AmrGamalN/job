import Profile from "../models/mongodb/profiles/profile.model";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const generateUniqueLink = async (
  firstName?: string,
  lastName?: string
): Promise<{ link: string; userName?: string }> => {
  let hash;
  let isLinkExist;
  do {
    hash = crypto.randomBytes(15).toString("hex");
    isLinkExist = await Profile.exists({
      profileLink: `${process.env.BACKEND_URL}/api/v1/profile/link/${firstName}${lastName}-${hash}`,
    });
  } while (isLinkExist);
  return {
    link: `${process.env.BACKEND_URL}/api/v1/profile/link/${firstName}${lastName}-${hash}`,
    userName: `${firstName}${lastName}-${hash}`,
  };
};

export const generateFeedbackLink = async (
  companyName?: string
): Promise<{ link: string; userName?: string }> => {
  let hash;
  let isLinkExist;
  do {
    hash = crypto.randomBytes(35).toString("hex");
    isLinkExist = await Profile.exists({
      profileLink: `${process.env.BACKEND_URL}/api/v1/company/feedback/${companyName}-${hash}`,
    });
  } while (isLinkExist);
  return {
    link: `${process.env.BACKEND_URL}/api/v1/company/feedback/${companyName}-${hash}`,
  };
};
