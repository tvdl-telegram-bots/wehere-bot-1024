export type Role = "angel" | "mortal";

export type ChatResponse =
  | {
      type: "noop";
    }
  | {
      type: "send";
      payload: { toUserId: number; text: string };
    }
  | {
      type: "reply";
      payload: string;
    }
  | {
      type: "block";
      payload: ChatResponse[];
    };

export type Message = {
  timestamp: number;
  fromUserId: number | null;
  toUserId: number | null;
  text: string;
};

export type CommandContext = {
  chatId: number;
  fromUserId: number;
  text: string;
  args: string[];
};

export type Command = {
  match: (args: string[]) => boolean;
  handler: (context: CommandContext) => Promise<ChatResponse>;
};

export type Angel = {
  userId: number;
  isOnline: boolean;
  replyingTo: number | null;
};

export type Chat = {
  userId: number;
  chatId: number;
};
