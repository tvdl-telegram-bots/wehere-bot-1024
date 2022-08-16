import { CommandHandler } from "../classes/Router";
import { Stateful } from "../classes/Stateful";
import { ChatResponse, UserError } from "../types";
import { expectNonEmptyString } from "../utils/assert";
import { EMOJI_ANGEL, EMOJI_MORTAL } from "../utils/emojis";

async function handleMessageFromAngel(
  content: string,
  stateful: Stateful,
  { fromUserId }: { fromUserId: number }
): Promise<ChatResponse> {
  const angel = await stateful.getAngel({ userId: fromUserId });
  if (!angel) {
    return { type: "reply", payload: "Hey! You are not an angel." };
  }
  if (!angel.isOnline) {
    return { type: "reply", payload: "You are not online yet." };
  }
  if (!angel.replyingTo) {
    return { type: "reply", payload: "You are not replying to anyone." };
  }
  await stateful.addMessage({
    timestamp: Date.now(),
    fromUserId: null,
    toUserId: angel.replyingTo,
    text: content,
  });
  const onlineAngels = await stateful.getOnlineAngels();
  const sendingMessageToMortal: ChatResponse = {
    type: "send",
    payload: { toUserId: angel.replyingTo, text: content },
  };
  const sendingMessagesToOnlineAngels: ChatResponse[] = onlineAngels.map(
    (thatAngel) => ({
      type: "send",
      payload: {
        toUserId: thatAngel.userId,
        text: `[${angel.replyingTo}] ${EMOJI_ANGEL}: ${content}`,
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
        text: `[${fromUserId}] ${EMOJI_MORTAL}: ${content}`,
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
  if (args.length !== 2) {
    throw new UserError("Oops! Invalid syntax.");
  }
  const content = expectNonEmptyString(args[1]);

  const role = await stateful.getRole({ userId: fromUserId });
  switch (role) {
    case "angel":
      return handleMessageFromAngel(content, stateful, { fromUserId });
    case "mortal":
      return handleMessageFromMortal(content, stateful, { fromUserId });
    default:
      throw new TypeError(`invalid role ${JSON.stringify({ role })}`);
  }
};
