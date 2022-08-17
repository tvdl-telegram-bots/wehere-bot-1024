import TelegramBot from "node-telegram-bot-api";
import { Command, CommandContext, ChatResponse } from "../types";
import { UserError } from "../errors";
import { expectInteger } from "../utils/assert";
import { parseArgs } from "../utils/common";
import { Stateful } from "./Stateful";

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
  private commands: Command[];
  private newCommands: NewCommand[];
  private bot: TelegramBot;
  private stateful: Stateful;

  constructor({
    commands,
    newCommands,
    bot,
    stateful,
  }: {
    commands: Command[];
    newCommands: NewCommand[];
    bot: TelegramBot;
    stateful: Stateful;
  }) {
    this.commands = commands;
    this.newCommands = newCommands;
    this.bot = bot;
    this.stateful = stateful;
  }

  async runCommand(
    command: Command,
    context: CommandContext
  ): Promise<ChatResponse> {
    try {
      if (!command) {
        throw new Error(`unknown command ${JSON.stringify({ context })}`);
      }
      return await command.handler(context);
    } catch (error) {
      return {
        type: "reply",
        payload: error instanceof Error ? error.message : JSON.stringify(error),
      };
    }
  }

  formatDebugInfo(debugInfo: unknown): string {
    if (!debugInfo) return "";
    return "\n\n" + JSON.stringify(debugInfo);
  }

  async respondWith(res: ChatResponse, context: CommandContext) {
    switch (res.type) {
      case "noop":
        break;

      case "send": {
        const recipientChatId = await this.stateful.getChatId({
          userId: res.payload.toUserId,
        });
        await this.bot.sendMessage(
          expectInteger(recipientChatId),
          res.payload.text
        );
        break;
      }

      case "reply": {
        const senderChatId = await this.stateful.getChatId({
          userId: context.fromUserId,
        });
        const shouldShowDebug =
          (await this.stateful.getUserVariable({
            userId: context.fromUserId,
            key: "debug",
          })) === "true";
        await this.bot.sendMessage(
          expectInteger(senderChatId),
          res.payload +
            (shouldShowDebug ? this.formatDebugInfo(res.debugInfo) : "")
        );
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
    const args = text.startsWith("/") ? parseArgs(text) : ["/default", text];
    const context: CommandContext = { chatId, fromUserId, text, args };
    console.log(`> ${JSON.stringify(context)}`);

    try {
      const matchedNewCommand = this.newCommands.find(([matcher, _]) =>
        this.isNewCommandMatched(matcher, context)
      );
      if (matchedNewCommand) {
        const [_, handler] = matchedNewCommand;
        const res = await handler(this.stateful, context);
        console.log(`< ${JSON.stringify(res)}`);
        await this.respondWith(res, context);
        return;
      }

      const matchedCommand = this.commands.find((cmd) => cmd.match(args));
      if (matchedCommand) {
        const res = await this.runCommand(matchedCommand, context);
        console.log(`< ${JSON.stringify(res)}`);
        await this.respondWith(res, context);
        return;
      }

      throw new Error(`unknown command ${JSON.stringify({ context })}`);
    } catch (error) {
      console.error(error);
      if (error instanceof UserError) {
        await this.bot.sendMessage(chatId, error.message);
      } else if (error instanceof Error) {
        await this.bot.sendMessage(chatId, error.message);
      } else {
        await this.bot.sendMessage(chatId, JSON.stringify(error));
      }
    }
  }
}
