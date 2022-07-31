import EventEmitter from "events";
import { Message, Subscription, SubscriptionEvent } from "../types";

const messageTable: Message[] = [];
const subscriptionTable: Subscription[] = [];

export class Store {
  eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  async insertMessage(message: Message) {
    messageTable.push(message);
    this.eventEmitter.emit("addMessage", message);
  }

  async selectMessages({
    filter,
    order,
    limit,
  }: {
    filter: { chatId?: number };
    order?: "asc" | "desc";
    limit?: number;
  }) {
    const filteredRows = messageTable.filter((row) => {
      if (!filter) return true;
      if (filter.chatId && row.chatId !== filter.chatId) return false;
      return true;
    });
    const sortedRows =
      order === "asc"
        ? [...filteredRows].sort((a, b) => a.timestamp - b.timestamp)
        : order === "desc"
        ? [...filteredRows].sort((a, b) => b.timestamp - a.timestamp)
        : filteredRows;
    const limitedRows = limit == null ? sortedRows : sortedRows.slice(0, limit);
    return limitedRows;
  }

  async insertSubscription(subscription: Subscription) {
    const index = subscriptionTable.findIndex(
      (item) =>
        item.chatId === subscription.chatId && item.event === subscription.event
    );
    if (index < 0) {
      subscriptionTable.push(subscription);
    }
  }

  async deleteSubscription(subscription: Subscription) {
    const index = subscriptionTable.findIndex(
      (item) =>
        item.chatId === subscription.chatId && item.event === subscription.event
    );
    if (index >= 0) {
      subscriptionTable.splice(index, 1);
    }
  }

  async selectSubscriptions({
    filter,
  }: {
    filter?: { event?: SubscriptionEvent };
  }) {
    const filteredRows = subscriptionTable.filter((row) => {
      if (!filter) return true;
      if (filter.event && row.event !== filter.event) return false;
      return true;
    });
    return filteredRows;
  }
}
