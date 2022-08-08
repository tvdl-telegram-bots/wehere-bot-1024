// this import must be at the top
import { DB_CONN_STRING, DB_NAME, TELEGRAM_BOT_TOKEN } from "./config";

import TelegramBot from "node-telegram-bot-api";

import { CommandDefault } from "./classes/commands/CommandDefault";
import { CommandGet } from "./classes/commands/CommandGet";
import { CommandGetOnlineAngels } from "./classes/commands/CommandGetOnlineAngels";
import { CommandReplyTo } from "./classes/commands/CommandReplyTo";
import { CommandSet } from "./classes/commands/CommandSet";
import { CommandSetAngelOffline } from "./classes/commands/CommandSetAngelOffline";
import { CommandSetAngelOnline } from "./classes/commands/CommandSetAngelOnline";
import { CommandStatus } from "./classes/commands/CommandStatus";
import { MongoClient } from "mongodb";
import { Router } from "./classes/Router";
import { Stateful } from "./classes/Stateful";
import { CommandGetLastMessages } from "./classes/commands/CommandGetLastMessages";

async function main() {
  const client = await MongoClient.connect(DB_CONN_STRING);
  const db = client.db(DB_NAME);
  const stateful = new Stateful({ db });
  console.log("Connected to DB.");

  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

  const router = new Router({
    commands: [
      new CommandSet({ stateful }),
      new CommandGet({ stateful }),
      new CommandStatus({ stateful }),
      new CommandSetAngelOnline({ stateful }),
      new CommandSetAngelOffline({ stateful }),
      new CommandGetOnlineAngels({ stateful }),
      new CommandDefault({ stateful }),
      new CommandReplyTo({ stateful }),
      new CommandGetLastMessages({ stateful }),
    ],
    bot,
    stateful,
  });

  console.log("Listening for events...");

  bot.on("message", async (message) => {
    await router.handleMessage(message);
  });
}

main();
