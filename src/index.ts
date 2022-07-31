import TelegramBot from "node-telegram-bot-api";
import { Angel } from "./classes/Angel";
import { Mortal } from "./classes/Mortal";
import { Store } from "./classes/Store";
import { ChatResponse, Message, Role } from "./types";

const token = process.env.TELEGRAM_BOT_TOKEN || "YOUR TELEGRAM BOT TOKEN";
const bot = new TelegramBot(token, { polling: true });

const store = new Store();

store.eventEmitter.addListener("addMessage", (message: Message) => {
  console.log({ message });
});

function getRole(message: TelegramBot.Message): Role {
  // TODO: check store to see if an user is mortal or angel
  if ((message.text || "").indexOf("/") >= 0) {
    return "angel";
  }
  return "mortal";
}

async function getChatResponse(
  message: TelegramBot.Message
): Promise<ChatResponse> {
  const chatId = message.chat.id;
  const fromId = message.from?.id;
  const messageText = message.text;
  if (!fromId || !messageText) return { type: "noop" };

  try {
    const role = getRole(message);
    switch (role) {
      case "mortal":
        return await Mortal.reply({ store, chatId, message: messageText });
      case "angel":
        return await Angel.reply({
          store,
          chatId,
          message: messageText,
          fromId,
        });
      default:
        throw new Error(`unknown role ${JSON.stringify({ role })}`);
    }
  } catch (error) {
    return {
      type: "send",
      payload: {
        chatId,
        message: error instanceof Error ? error.message : `${error}`,
      },
    };
  }
}

bot.on("message", async (message) => {
  const chatResponse = await getChatResponse(message);

  switch (chatResponse.type) {
    case "noop":
      break;
    case "send": {
      await bot.sendMessage(
        chatResponse.payload.chatId,
        chatResponse.payload.message
      );
      break;
    }
    default:
      throw new Error(`unknown type ${JSON.stringify({ chatResponse })}`);
  }
});

store.eventEmitter.on("addMessage", async (message: Message) => {
  if (message.fromAngelId) return;
  const subscriptions = await store.selectSubscriptions({
    filter: { event: "mortalNewMessage" },
  });
  subscriptions.forEach(({ chatId }) => {
    bot.sendMessage(
      chatId,
      `Received a message from mortal ${JSON.stringify({ message })}`
    );
  });
});
