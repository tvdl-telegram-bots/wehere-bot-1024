import TelegramBot from "node-telegram-bot-api";
import { Command, CommandContext, ChatResponse } from "../types";
import { parseArgs } from "../utils/common";
import { Stateful } from "./Stateful";

export class Router {
  private commands: Command[];
  private bot: TelegramBot;
  private stateful: Stateful;

  constructor({
    commands,
    bot,
    stateful,
  }: {
    commands: Command[];
    bot: TelegramBot;
    stateful: Stateful;
  }) {
    this.commands = commands;
    this.bot = bot;
    this.stateful = stateful;
  }

  async runCommand(
    command: Command | undefined,
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

  async respondWith(res: ChatResponse, context: CommandContext) {
    switch (res.type) {
      case "noop":
        break;

      case "send": {
        const chat = await this.stateful.getChat({
          userId: res.payload.toUserId,
        });
        const toChatId = chat?.chatId;
        if (!toChatId) {
          await this.bot.sendMessage(context.chatId, `unknown target chat`);
        } else {
          await this.bot.sendMessage(toChatId, res.payload.text);
        }
        break;
      }

      case "reply": {
        await this.bot.sendMessage(context.chatId, res.payload);
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

  async handleMessage(message: TelegramBot.Message) {
    const chatId = message.chat.id;
    const fromUserId = message.from?.id;
    const text = message.text;
    if (!fromUserId || !text) return;
    await this.stateful.setChat({ userId: fromUserId, chatId });
    const args = text.startsWith("/") ? parseArgs(text) : ["/default", text];
    const context: CommandContext = { chatId, fromUserId, text, args };
    console.log(`> ${JSON.stringify(context)}`);
    const matchedCommand = this.commands.find((cmd) => cmd.match(args));
    const res = await this.runCommand(matchedCommand, context);
    console.log(`< ${JSON.stringify(res)}`);
    await this.respondWith(res, context);
  }
}
