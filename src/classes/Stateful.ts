import { Db } from "mongodb";
import { Angel, Chat, Message, Role } from "../types";

export class Stateful {
  private db: Db;
  constructor({ db }: { db: Db }) {
    this.db = db;
  }

  async setChatVariable({
    chatId,
    key,
    value,
  }: {
    chatId: number;
    key: string;
    value: string;
  }) {
    await this.db
      .collection("env")
      .updateOne(
        { chatId, key },
        { $set: { chatId, key, value } },
        { upsert: true }
      );
  }

  async getChatVariable({ chatId, key }: { chatId: number; key: string }) {
    const row = await this.db.collection("env").findOne({ chatId, key });
    return row ? row.value : undefined;
  }

  async getRole({
    userId,
    chatId,
  }: {
    userId: number;
    chatId: number;
  }): Promise<Role> {
    const customRole = await this.getChatVariable({ chatId, key: "role" });
    if (["angel", "mortal"].includes(customRole)) {
      return customRole;
    }
    return [-1].includes(userId) ? "angel" : "mortal";
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
      .updateOne({ userId }, { $set: { isOnline } }, { upsert: true });
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

  async setAngelReplyingTo({
    userId,
    replyingTo,
  }: {
    userId: number;
    replyingTo: number;
  }) {
    await this.db
      .collection("angels")
      .updateOne({ userId }, { $set: { replyingTo } }, { upsert: true });
  }

  async getLastMessages({ limit }: { limit: number }) {
    return (await this.db
      .collection("messages")
      .find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()) as unknown as Message[];
  }
}
