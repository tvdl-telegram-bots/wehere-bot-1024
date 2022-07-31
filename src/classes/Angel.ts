import * as StringArgv from "string-argv";
import { ChatResponse } from "../types";
import { Expect } from "./Expect";
import { Store } from "./Store";

function parseArgs(message: string) {
  return StringArgv.parseArgsStringToArgv(message);
}

export class Angel {
  static async reply({
    store,
    chatId,
    message,
    fromId,
  }: {
    store: Store;
    chatId: number;
    message: string;
    fromId: number;
  }): Promise<ChatResponse> {
    const args = parseArgs(message);
    if (!args.length) return { type: "noop" };

    switch (args[0]) {
      case "/tail": {
        const messages = await store.selectMessages({
          filter: { chatId },
          order: "desc",
          limit: 10,
        });
        const sortedMessages = [...messages].sort(
          (a, b) => a.timestamp - b.timestamp
        );
        return {
          type: "send",
          payload: {
            chatId,
            message: JSON.stringify(sortedMessages, null, 2),
          },
        };
      }

      case "/send": {
        const targetChatId = Expect.expectInteger(args[1]);
        const targetMessage = Expect.expectString(args[2]);

        await store.insertMessage({
          timestamp: Date.now(),
          chatId: targetChatId,
          fromAngelId: fromId,
          message: targetMessage,
        });

        return {
          type: "send",
          payload: {
            chatId: targetChatId,
            message: targetMessage,
          },
        };
      }

      case "/subscribe": {
        await store.insertSubscription({ chatId, event: "mortalNewMessage" });
        return {
          type: "send",
          payload: {
            chatId,
            message: `Subscribed ${JSON.stringify({ chatId })}}`,
          },
        };
      }

      case "/unsubscribe": {
        await store.deleteSubscription({ chatId, event: "mortalNewMessage" });
        return {
          type: "send",
          payload: {
            chatId,
            message: `Unsubscribed ${JSON.stringify({ chatId })}}`,
          },
        };
      }

      default: {
        throw new Error(`unknown cmd ${JSON.stringify({ message, args })}`);
      }
    }
  }
}
