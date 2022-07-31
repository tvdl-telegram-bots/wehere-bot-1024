export type Role = "angel" | "mortal";

export type ChatResponse =
  | {
      type: "noop";
    }
  | {
      type: "send";
      payload: {
        chatId: number;
        message: string;
      };
    };

export type Message = {
  timestamp: number; // primary key
  chatId: number;
  fromAngelId: number | null;
  message: string;
};

export type SubscriptionEvent = "mortalNewMessage";

export type Subscription = {
  chatId: number; // co-primary key
  event: SubscriptionEvent;
};
