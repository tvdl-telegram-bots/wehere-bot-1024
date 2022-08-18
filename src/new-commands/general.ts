import { CommandHandler } from "../classes/Router";
import { UserError } from "../errors";

import { getUsername } from "../utils/usernames";

export const start: CommandHandler = async (stateful, { fromUserId }) => {
  const role = await stateful.getRole({ userId: fromUserId });
  switch (role) {
    case "angel":
      return {
        type: "reply",
        payload:
          stateful.t("msg_welcome_angel", {
            username: getUsername(fromUserId),
          }) +
          "\n\n" +
          ["/status"].join("\n"),
      };
    case "mortal":
      return {
        type: "reply",
        payload: stateful.t("msg_welcome_mortal", {
          username: getUsername(fromUserId),
        }),
      };
    default:
      throw new UserError(stateful.t("msg_invalid_role"), { role, fromUserId });
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
        payload: stateful.t("msg_hello_username", {
          username: getUsername(fromUserId),
        }),
        debugInfo: { fromUserId, role },
      };
    }
    case "angel": {
      const angel = await stateful.getAngel({ userId: fromUserId });
      UserError.assert(angel, stateful.t("msg_you_not_angel"), [
        { fromUserId },
      ]);
      return {
        type: "reply",
        payload: [
          stateful.t("msg_hello_angel_username", {
            username: getUsername(fromUserId),
          }),
          angel.isOnline
            ? stateful.t("msg_you_online")
            : stateful.t("msg_you_offline"),
          angel.replyingTo
            ? stateful.t("msg_you_replying_to_username", {
                username: getUsername(angel.replyingTo),
              })
            : stateful.t("msg_you_not_replying_anyone"),
          "",
          angel.isOnline
            ? stateful.t("msg_to_stop_receiving_noti", {
                command: "/set_angel_offline",
              })
            : stateful.t("msg_to_start_receiving_noti", {
                command: "/set_angel_online",
              }),
          angel.isOnline
            ? stateful.t("msg_to_reply_a_mortal", {
                command: "/reply_to <mortal-user-id>",
              })
            : "",
        ].join("\n"),
        debugInfo: { fromUserId, role },
      };
    }
    default: {
      throw new UserError(stateful.t("msg_invalid_role"), { role });
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
    payload: stateful.t("msg_debug_info_shown"),
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
    payload: stateful.t("msg_debug_info_hidden"),
  };
};
