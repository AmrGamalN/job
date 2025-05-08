import { CustomError } from "./customError.util";

// "pending->accepted": Accepting a connection request, updating pending and accepted statuses for both users.
// "accepted->unfriend": Unfriending the user, removing the connection by decreasing accepted for both.
// "unBlocked->blocked": Blocking the user after unblocking, increasing blocked status for the blocker.
// "blocked->unBlocked": Unblocking the user, decreasing blocked status for the unblocking user.

const validateTransition = (
  currUserId: string,
  actionBy?: string | null,
  blockedStatus?: string,
  senderId?: string
) => {
  if (
    blockedStatus === "blocked" &&
    (currUserId === senderId || currUserId !== actionBy)
  ) {
    throw new CustomError("User already blocked", "Conflict", false, 409);
  }

  if (currUserId === senderId) {
    throw new CustomError(
      "You cannot accept your connection request",
      "Conflict",
      false,
      409
    );
  }

  if (actionBy !== currUserId) {
    throw new CustomError(
      "You cannot unblock this user because you didn't block them",
      "Conflict",
      false,
      409
    );
  }

  if (actionBy !== currUserId && blockedStatus === "blocked") {
    throw new CustomError(
      "You cannot block this user because they have already blocked you",
      "Conflict",
      false,
      409
    );
  }
};

// Handle connection status changes between users
export const connectionStatusMapping = (key: string) => {
  const invalidStatus: Record<string, string> = {
    "pending->pending": "Already sent a connection request",
    "pending->unfriend": "Cannot unfriend a pending connection",
    "accepted->accepted": "Both users are already friends",
    "accepted->pending": "Invalid status",
    "blocked->blocked": "User already blocked",
    "unBlocked->unBlocked": "User already unblocked",
  };
  const errorMessage = invalidStatus[key];
  if (errorMessage) {
    throw new CustomError(errorMessage, "Conflict", false, 409);
  }

  const updateFieldsByStatus: Record<
    string,
    {
      fields: string[];
      updates: number[];
      target: "both" | "actionBy";
      deleteConnection?: boolean;
      validateTransition?: (
        currUserId: string,
        actionBy?: string | null,
        blockedStatus?: string,
        senderId?: string
      ) => void;
    }
  > = {
    "pending->accepted": {
      fields: ["pending", "accepted"],
      updates: [-1, 1],
      target: "both",
      validateTransition,
    },
    "accepted->unfriend": {
      fields: ["accepted"],
      updates: [-1],
      target: "both",
      deleteConnection: true,
    },
    "unBlocked->blocked": {
      fields: ["blocked"],
      updates: [1],
      target: "actionBy",
      validateTransition,
    },
    "blocked->unBlocked": {
      fields: ["blocked"],
      updates: [-1],
      target: "actionBy",
      validateTransition,
    },
  };

  return updateFieldsByStatus[key];
};
