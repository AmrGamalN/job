import Profile from "../models/mongodb/client/profile.model";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
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

export const generateLink = async (
  route?: string
): Promise<{ link: string; userName?: string }> => {
  let hash;
  let isLinkExist;
  do {
    hash = crypto.randomBytes(35).toString("hex");
    isLinkExist = await Profile.exists({
      profileLink: `${process.env.BACKEND_URL}/api/v1/${route}/${hash}`,
    });
  } while (isLinkExist);
  return {
    link: `${process.env.BACKEND_URL}/api/v1/${route}/${hash}`,
  };
};
