import TelegramBot from "node-telegram-bot-api";
import { CommandContext, ChatResponse } from "../types";
import { UserError } from "../errors";
import { Stateful } from "./Stateful";

import { parseArgsCustomized, sleep } from "../utils/common";

export type CommandMatcher =
  | string
  | RegExp
  | ((context: CommandContext) => boolean);

export type CommandHandler = (
  stateful: Stateful,
  context: CommandContext
) => Promise<ChatResponse>;

export type NewCommand = [CommandMatcher, CommandHandler];

export class Router {
  private newCommands: NewCommand[];
  private bot: TelegramBot;
  private stateful: Stateful;

  constructor({
    newCommands,
    bot,
    stateful,
  }: {
    newCommands: NewCommand[];
    bot: TelegramBot;
    stateful: Stateful;
  }) {
    this.newCommands = newCommands;
    this.bot = bot;
    this.stateful = stateful;
  }

  async respondWith(
    res: ChatResponse,
    context: { fromUserId: number; chatId: number }
  ) {
    switch (res.type) {
      case "noop":
        break;

      case "send": {
        const recipientChatId = await this.stateful.getChatId({
          userId: res.payload.toUserId,
        });
        UserError.assert(
          recipientChatId && Number.isFinite(recipientChatId),
          "!invalid recipient chat id"
        );
        await this.bot.sendMessage(recipientChatId, res.payload.text);
        await sleep(35); // Telegram limit: max 30 messages per second
        break;
      }

      case "reply": {
        const shouldShowDebug =
          (await this.stateful.getUserVariable({
            userId: context.fromUserId,
            key: "debug",
          })) === "true";
        const finalResponse =
          res.payload +
          (shouldShowDebug && res.debugInfo !== undefined
            ? "\n\n" + JSON.stringify(res.debugInfo)
            : "");
        await this.bot.sendMessage(context.chatId, finalResponse);
        await sleep(35); // Telegram limit: max 30 messages per second
        break;
      }

      case "block": {
        const promises = res.payload.map((item) =>
          this.respondWith(item, context)
        );
        await Promise.all(promises);
        break;
      }
      default:
        throw new Error(`unknown type ${JSON.stringify({ res })}`);
    }
    await sleep(3000); // Telegram limit: max 20 messages per minute for each user
  }

  isNewCommandMatched(matcher: CommandMatcher, context: CommandContext) {
    const headArg = context.args[0];
    if (!headArg) return false;
    if (matcher instanceof RegExp) {
      return matcher.test(headArg);
    } else if (typeof matcher === "string") {
      return matcher === headArg;
    } else if (typeof matcher === "function") {
      return matcher(context);
    } else {
      throw new TypeError("invalid matcher");
    }
  }

  async handleMessage(message: TelegramBot.Message) {
    const chatId = message.chat.id;
    const fromUserId = message.from?.id;
    const text = message.text;
    if (!fromUserId || !text) return;
    await this.stateful.setChat({ userId: fromUserId, chatId });
    const args = parseArgsCustomized(text);
    const context: CommandContext = { fromUserId, text, args };
    console.log(`> ${JSON.stringify(context)}`);

    try {
      const matchedNewCommand = this.newCommands.find(([matcher, _]) =>
        this.isNewCommandMatched(matcher, context)
      );
      UserError.assert(
        matchedNewCommand,
        this.stateful.t("msg_unknown_command"),
        { context }
      );
      const [_, handler] = matchedNewCommand;
      const res = await handler(this.stateful, context);
      console.log(`< ${JSON.stringify(res)}`);
      await this.respondWith(res, { fromUserId, chatId });
      return;
    } catch (error) {
      console.error(error);
      if (process.exitCode !== undefined) {
        await this.bot.sendMessage(
          chatId,
          error instanceof Error ? error.message : JSON.stringify(error)
        );
        setTimeout(() => process.exit(), 1000);
      } else if (error instanceof UserError) {
        await this.bot.sendMessage(chatId, error.message);
      } else if (error instanceof Error) {
        await this.bot.sendMessage(chatId, error.message);
      } else {
        await this.bot.sendMessage(chatId, JSON.stringify(error));
      }
    }
  }
}
