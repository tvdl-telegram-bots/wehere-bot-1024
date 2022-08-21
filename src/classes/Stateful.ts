import * as I18next from "i18next";
import { Db } from "mongodb";
import { Angel, Chat, Message, Role } from "../types";

import { expectInteger, expectString } from "../utils/assert";

export class Stateful {
  private db: Db;
  private i18n: I18next.i18n;
  constructor({ db, i18n }: { db: Db; i18n: I18next.i18n }) {
    this.db = db;
    this.i18n = i18n;
  }

  async setUserVariable(update: {
    userId: number;
    key: string;
    value: string;
  }) {
    await this.db
      .collection("uservars")
      .updateOne(
        { userId: update.userId, key: update.key },
        { $set: update },
        { upsert: true }
      );
  }

  async unsetUserVariable(filter: { userId: number; key: string }) {
    await this.db.collection("uservars").deleteOne(filter);
  }

  async getUserVariable(filter: {
    userId: number;
    key: string;
  }): Promise<string | undefined> {
    const doc = await this.db.collection("uservars").findOne(filter);
    return doc ? expectString(doc.value) : undefined;
  }

  async getRole({ userId }: { userId: number }): Promise<Role> {
    const customRole = await this.getUserVariable({ userId, key: "role" });
    if (customRole === "angel" || customRole === "mortal") {
      return customRole;
    }

    const angel = await this.getAngel({ userId });
    return angel ? "angel" : "mortal";
  }

  async addMessage(message: Message) {
    await this.db.collection("messages").insertOne(message);
  }

  async setAngelOnlineStatus({
    userId,
    isOnline,
  }: {
    userId: number;
    isOnline: boolean;
  }) {
    await this.db
      .collection("angels")
      .updateOne({ userId }, { $set: { isOnline } });
  }

  async getOnlineAngels() {
    return (await this.db
      .collection("angels")
      .find({ isOnline: true })
      .toArray()) as unknown as Angel[];
  }

  async getAngel({ userId }: { userId: number }) {
    return (await this.db
      .collection("angels")
      .findOne({ userId })) as unknown as Angel | undefined;
  }

  async addAngel({ userId }: { userId: number }) {
    const angel: Angel = { userId, isOnline: false, replyingTo: null };
    await this.db.collection("angels").insertOne(angel);
  }

  async removeAngel({ userId }: { userId: number }) {
    await this.db.collection("angels").deleteOne({ userId });
  }

  async setChat(chat: Chat) {
    await this.db
      .collection("chats")
      .updateOne({ userId: chat.userId }, { $set: chat }, { upsert: true });
  }

  async getChat({ userId }: { userId: number }) {
    return (await this.db
      .collection("chats")
      .findOne({ userId })) as unknown as Chat | undefined;
  }

  async getChatId({ userId }: { userId: number }) {
    const chat = (await this.db
      .collection("chats")
      .findOne({ userId })) as unknown as Chat | undefined;
    return chat ? expectInteger(chat.chatId) : undefined;
  }

  async setAngelReplyingTo({
    userId,
    replyingTo,
  }: {
    userId: number;
    replyingTo: number;
  }) {
    await this.db
      .collection("angels")
      .updateOne({ userId }, { $set: { replyingTo } });
  }

  // async getLastMessages({ limit }: { limit: number }) {
  //   return (await this.db
  //     .collection("messages")
  //     .find()
  //     .sort({ timestamp: -1 })
  //     .limit(limit)
  //     .toArray()) as unknown as Message[];
  // }

  async getMessagesStrictlyBefore({
    timestamp,
    limit,
  }: {
    timestamp: number;
    limit: number;
  }) {
    const messages: Message[] = (await this.db
      .collection("messages")
      .find({ timestamp: { $lt: timestamp } })
      .sort({ timestamp: 1 })
      .limit(limit)
      .toArray()) as any[];
    messages.sort((a, b) => a.timestamp - b.timestamp);
    return messages;
  }

  async getMessagesStrictlyAfter({
    timestamp,
    limit,
  }: {
    timestamp: number;
    limit: number;
  }) {
    const messages: Message[] = (await this.db
      .collection("messages")
      .find({ timestamp: { $gt: timestamp } })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()) as any[];
    messages.sort((a, b) => a.timestamp - b.timestamp);
    return messages;
  }

  async dropDatabase() {
    return await this.db.dropDatabase();
  }

  t(keys: string | string[], options?: I18next.TOptions): string {
    const language = "vi"; // TODO: do not hard-code
    return this.i18n.t(keys, { lng: language, ...options });
  }
}
