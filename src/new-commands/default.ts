import { EMOJI_ANGEL, EMOJI_MORTAL } from "../utils/emojis";

import { CommandHandler } from "../classes/Router";
import { Stateful } from "../classes/Stateful";
import { ChatResponse } from "../types";
import { UserError } from "../errors";

import { getUsername } from "../utils/usernames";

async function handleMessageFromAngel(
  content: string,
  stateful: Stateful,
  { fromUserId }: { fromUserId: number }
): Promise<ChatResponse> {
  const angel = await stateful.getAngel({ userId: fromUserId });
  UserError.assert(angel, stateful.t("msg_you_not_angel"));
  UserError.assert(angel.isOnline, stateful.t("msg_you_offline"));
  UserError.assert(angel.replyingTo, stateful.t("msg_you_not_replying_anyone"));
  await stateful.addMessage({
    timestamp: Date.now(),
    fromUserId: null,
    toUserId: angel.replyingTo,
    text: content,
  });
  const mortalUserId = angel.replyingTo;
  const onlineAngels = await stateful.getOnlineAngels();
  const sendingMessageToMortal: ChatResponse = {
    type: "send",
    payload: { toUserId: mortalUserId, text: content },
  };
  const sendingMessagesToOnlineAngels: ChatResponse[] = onlineAngels.map(
    (thatAngel) => ({
      type: "send",
      payload: {
        toUserId: thatAngel.userId,
        text: `[${getUsername(mortalUserId)}] ${EMOJI_ANGEL}: ${content}`,
      },
    })
  );
  return {
    type: "block",
    payload: [sendingMessageToMortal, ...sendingMessagesToOnlineAngels],
  };
}

async function handleMessageFromMortal(
  content: string,
  stateful: Stateful,
  { fromUserId }: { fromUserId: number }
): Promise<ChatResponse> {
  await stateful.addMessage({
    timestamp: Date.now(),
    fromUserId: fromUserId,
    toUserId: null,
    text: content,
  });
  const onlineAngels = await stateful.getOnlineAngels();
  const sendingMessagesToOnlineAngels: ChatResponse[] = onlineAngels.map(
    (thatAngel) => ({
      type: "send",
      payload: {
        toUserId: thatAngel.userId,
        text: `[${getUsername(fromUserId)}] ${EMOJI_MORTAL}: ${content}`,
      },
    })
  );
  return {
    type: "block",
    payload: sendingMessagesToOnlineAngels,
  };
}

export const default_: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  const content = args[1];
  UserError.assert(
    args.length === 2 && content,
    stateful.t("msg_invalid_syntax", { syntax: "/default <text>" })
  );
  const role = await stateful.getRole({ userId: fromUserId });
  switch (role) {
    case "angel":
      return handleMessageFromAngel(content, stateful, { fromUserId });
    case "mortal":
      return handleMessageFromMortal(content, stateful, { fromUserId });
    default:
      throw new UserError(stateful.t("msg_invalid_role"), { role, fromUserId });
  }
};
