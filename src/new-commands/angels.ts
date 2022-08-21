import { CommandHandler } from "../classes/Router";
import { UserError } from "../errors";
import { EMOJI_ANGEL, EMOJI_MORTAL } from "../utils/emojis";

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
        ? stateful.t("msg_no_angels_online")
        : stateful.t("msg_count_angels_online", { count: angels.length }) +
          "\n\n" +
          angels.map((angel) => getUsername(angel.userId)).join("\n"),
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

export const get_messages: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  const angel = await stateful.getAngel({ userId: fromUserId });
  UserError.assert(angel, stateful.t("msg_you_not_angel"));
  const filterQuery = args[1];

  const getMessages = async () => {
    if (!filterQuery) {
      const timestamp = Date.now();
      return await stateful.getMessagesStrictlyBefore({ timestamp, limit: 50 });
    }
    const matches1 = /^lt\:([0-9]+)$/.exec(filterQuery);
    if (matches1) {
      const timestamp = parseInt(matches1[1], 10);
      return await stateful.getMessagesStrictlyBefore({ timestamp, limit: 50 });
    }

    const matches2 = /^gt\:([0-9]+)$/.exec(filterQuery);
    if (matches2) {
      const timestamp = parseInt(matches2[1], 10);
      return await stateful.getMessagesStrictlyAfter({ timestamp, limit: 50 });
    }

    throw new UserError(
      stateful.t("msg_invalid_syntax", {
        syntax: "/get_messages [(lt|gt):<timestamp>]",
      })
    );
  };

  const messages = await getMessages();

  UserError.assert(messages.length, stateful.t("msg_no_messages_found"));
  const paragraphs = messages.map(
    ({ timestamp, text, fromUserId, toUserId }) => {
      return [
        `[${new Date(timestamp).toLocaleString("vi-VN")}]`,
        `[from:${fromUserId ? getUsername(fromUserId) : "angels"}]`,
        `[to:${toUserId ? getUsername(toUserId) : "angels"}]`,
        `\n${fromUserId ? EMOJI_MORTAL : EMOJI_ANGEL}: `,
        text,
      ].join("");
    }
  );

  paragraphs.push(
    [
      stateful.t("msg_to_get_messages_before_type_syntax", {
        syntax: `/get_messages lt:${messages[0].timestamp}`,
      }),
      stateful.t("msg_to_get_messages_after_type_syntax", {
        syntax: `/get_messages gt:${messages[messages.length - 1].timestamp}`,
      }),
    ].join("\n")
  );

  return {
    type: "reply",
    payload: paragraphs.join("\n\n"),
  };
};
