import Profile from "../models/mongodb/profiles/profile.model";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const generateUniqueProfile = async (
  firstName: string,
  lastName: string
): Promise<{ profileLink: string; userName: string }> => {
  let hash;
  let isLinkExist;
  do {
    hash = crypto.randomBytes(6).toString("hex");
    isLinkExist = await Profile.exists({
      profileLink: `${process.env.BACKEND_URL}/api/v1/profile/${firstName}${lastName}-${hash}`,
    });
  } while (isLinkExist);

  return {
    profileLink: `${process.env.BACKEND_URL}/api/v1/profile/${firstName}${lastName}-${hash}`,
    userName: `${firstName}${lastName}-${hash}`,
  };
};
