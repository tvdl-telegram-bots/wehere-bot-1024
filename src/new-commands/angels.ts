import { CommandHandler } from "../classes/Router";
import { UserError } from "../errors";

import { getUserid, getUsername } from "../utils/usernames";

export const get_online_angels: CommandHandler = async (stateful, { args }) => {
  UserError.assert(
    args.length === 1,
    stateful.t("msg_invalid_syntax", { syntax: "/get_online_angels" })
  );
  const angels = await stateful.getOnlineAngels();
  return {
    type: "reply",
    payload:
      angels.length === 0
        ? "No online angels :(" // TODO: translate
        : `${angels.length} angels are online:\n\n` + // TODO: translate
          angels.map((angel) => `${getUsername(angel.userId)}`).join("\n"),
    debugInfo: { angels },
  };
};

export const set_angel_online: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  UserError.assert(
    args.length === 1,
    stateful.t("msg_invalid_syntax", { syntax: "/set_angel_online" })
  );
  const angel = await stateful.getAngel({ userId: fromUserId });
  UserError.assert(angel, stateful.t("msg_you_not_angel"));
  const update = { userId: fromUserId, isOnline: true };
  await stateful.setAngelOnlineStatus(update);
  return { type: "reply", payload: stateful.t("msg_you_set_online") };
};

export const set_angel_offline: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  UserError.assert(
    args.length === 1,
    stateful.t("msg_invalid_syntax", { syntax: "/set_angel_offline" })
  );
  const angel = await stateful.getAngel({ userId: fromUserId });
  UserError.assert(angel, stateful.t("msg_you_not_angel"));
  const update = { userId: fromUserId, isOnline: false };
  await stateful.setAngelOnlineStatus(update);
  return { type: "reply", payload: stateful.t("msg_you_set_offline") };
};

export const reply_to: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  const username = args[1];
  UserError.assert(
    args.length === 2 && username,
    stateful.t("msg_invalid_syntax", { syntax: "/reply_to <username>" })
  );
  const userid = getUserid(username);
  UserError.assert(userid, stateful.t("msg_cannot_get_userid"));
  const angel = await stateful.getAngel({ userId: fromUserId });
  UserError.assert(angel, stateful.t("msg_you_not_angel"));
  UserError.assert(angel.isOnline, stateful.t("msg_you_offline"));
  const update = { userId: angel.userId, replyingTo: userid };
  await stateful.setAngelReplyingTo(update);
  return {
    type: "reply",
    payload: stateful.t("msg_you_replying_to_username", {
      username: getUsername(userid),
    }),
  };
};
