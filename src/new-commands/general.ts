import { CommandHandler } from "../classes/Router";
import { UserError } from "../types";
import { getUsername } from "../utils/usernames";

export const start: CommandHandler = async (stateful, { fromUserId }) => {
  const role = await stateful.getRole({ userId: fromUserId });
  switch (role) {
    case "angel": {
      return {
        type: "reply",
        payload:
          `Hello angel ${fromUserId}! Here are some commands that you can try:\n\n` +
          ["/status"].join("\n"),
      };
    }
    case "mortal": {
      return {
        type: "reply",
        payload: [
          stateful.t("msg_hello"),
          `Hello ${fromUserId}!`,
          `Just type your question. We will be notified and answer you as soon as possible`,
        ].join("\n"),
      };
    }
    default: {
      throw new TypeError(
        `invalid role ${JSON.stringify({ role, fromUserId })}`
      );
    }
  }
};

export const status: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  if (args.length !== 1) {
    throw new UserError("Oops! Invalid syntax.\nSyntax: /status");
  }
  const role = await stateful.getRole({ userId: fromUserId });
  switch (role) {
    case "mortal": {
      return {
        type: "reply",
        payload: `Hello ${getUsername(fromUserId)}!`,
        debugInfo: [{ fromUserId, role }],
      };
    }
    case "angel": {
      const angel = await stateful.getAngel({ userId: fromUserId });
      if (!angel)
        throw new Error(`angel not found ${JSON.stringify({ fromUserId })}`);
      return {
        type: "reply",
        payload: [
          `Hello angel ${getUsername(fromUserId)}!`,
          angel.isOnline ? `You are now online.` : `You are now offline.`,
          angel.replyingTo
            ? `You are replying to ${getUsername(angel.replyingTo)}.`
            : `You are not replying to any mortal.`,
          "",
          angel.isOnline
            ? `To stop receiving notifications, type /set_angel_offline`
            : `To start receiving notifications, type /set_angel_online`,
          angel.isOnline
            ? `To reply a mortal, type /reply_to <mortal-user-id>`
            : "",
        ].join("\n"),
        debugInfo: [{ fromUserId, role }],
      };
    }
    default: {
      throw new TypeError(`invalid role ${JSON.stringify({ role })}`);
    }
  }
};

export const show_debug: CommandHandler = async (stateful, { fromUserId }) => {
  await stateful.setUserVariable({
    userId: fromUserId,
    key: "debug",
    value: "true",
  });
  return {
    type: "reply",
    payload: "Debug info will be shown.",
  };
};

export const hide_debug: CommandHandler = async (stateful, { fromUserId }) => {
  await stateful.setUserVariable({
    userId: fromUserId,
    key: "debug",
    value: "false",
  });
  return {
    type: "reply",
    payload: "Debug info will be hidden.",
  };
};
