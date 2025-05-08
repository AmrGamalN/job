import { NextFunction } from "express";
import { Model } from "mongoose";
import { ClientSession } from "mongoose";

type userMainType = {
  page: number;
  limit: number;
};

// Connection model
export type ConnectionFiltersType = userMainType & {
  status: "pending" | "accepted";
  blockStatus: "blocked" | "unBlocked";
  recipientName: string;
};
export const connectionEnum = ["pending", "accepted", "unfriend"] as const;
export const blockEnum = ["blocked", "unBlocked"] as const;
export type ActivityConnectionType = {
  change: number[];
  fields?: string[];
  senderId?: string | null;
  recipientId?: string;
  session?: ClientSession;
};

// Interest model
export type InterestType =
  | "industries"
  | "hobbies"
  | "influencers"
  | "companies"
  | "groups";

// Follow model
export type FollowFiltersType = {
  page: number;
  limit: number;
  start?: Date;
  end?: Date;
  nameFollowing: string;
  nameFollower: string;
  followingType: "user" | "company" | "school";
};
