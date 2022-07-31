import { ChatResponse } from "../types";
import { Store } from "./Store";

export class Mortal {
  static async reply({
    store,
    chatId,
    message,
  }: {
    store: Store;
    chatId: number;
    message: string;
  }): Promise<ChatResponse> {
    await store.insertMessage({
      timestamp: Date.now(),
      chatId,
      fromAngelId: null,
      message,
    });
    return {
      type: "noop",
    };
  }
}
