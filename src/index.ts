// this import must be at the top
import { DB_CONN_STRING, DB_NAME, TELEGRAM_BOT_TOKEN } from "./config";

import TelegramBot from "node-telegram-bot-api";
import * as I18next from "i18next";

import { CommandDefault } from "./classes/commands/CommandDefault";
import { CommandReplyTo } from "./classes/commands/CommandReplyTo";
import { CommandSetAngelOffline } from "./classes/commands/CommandSetAngelOffline";
import { CommandSetAngelOnline } from "./classes/commands/CommandSetAngelOnline";
import { MongoClient } from "mongodb";
import { Router } from "./classes/Router";
import { Stateful } from "./classes/Stateful";
import { CommandGetLastMessages } from "./classes/commands/CommandGetLastMessages";

import { get_role, set_role, unset_role } from "./new-commands/roles";
import { get_online_angels } from "./new-commands/angels";
import { hide_debug, show_debug, start, status } from "./new-commands/general";

import { translations } from "./translations";

async function getI18n() {
  const i18n = I18next.createInstance();
  await i18n.init({
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    resources: {
      en: { translation: translations.en },
      vi: { translation: translations.vi },
    },
    debug: true,
  });
  return i18n;
}

async function getDb() {
  const client = await MongoClient.connect(DB_CONN_STRING);
  const db = client.db(DB_NAME);
  return db;
}

async function main() {
  const db = await getDb();
  const i18n = await getI18n();
  const stateful = new Stateful({ db, i18n });
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

  const router = new Router({
    newCommands: [
      ["/start", start],
      ["/status", status],
      ["/set_role", set_role],
      ["/unset_role", unset_role],
      ["/get_role", get_role],
      ["/get_online_angels", get_online_angels],
      ["/show_debug", show_debug],
      ["/hide_debug", hide_debug],
    ],
    commands: [
      new CommandSetAngelOnline({ stateful }),
      new CommandSetAngelOffline({ stateful }),
      new CommandReplyTo({ stateful }),
      new CommandGetLastMessages({ stateful }),
      new CommandDefault({ stateful }),
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
