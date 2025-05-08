// Post
export type MainType = {
  page: number;
  limit: number;
};
export type PostFiltersType = MainType & {
  hashtag: string;
};
export type CommentType = MainType;
export type ReactionType = MainType;

// Reaction
export const ReactionEnumType = [
  "like",
  "love",
  "haha",
  "wow",
  "sad",
  "angry",
] as const;
