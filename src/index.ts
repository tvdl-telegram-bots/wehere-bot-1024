// this import must be at the top
import { DB_CONN_STRING, DB_NAME, TELEGRAM_BOT_TOKEN } from "./config";

import TelegramBot from "node-telegram-bot-api";
import * as I18next from "i18next";

import { MongoClient } from "mongodb";
import { NewCommand, Router } from "./classes/Router";
import { Stateful } from "./classes/Stateful";

import { get_role, set_role, unset_role } from "./new-commands/roles";
import {
  get_online_angels,
  reply_to,
  set_angel_offline,
  set_angel_online,
} from "./new-commands/angels";
import { hide_debug, show_debug, start, status } from "./new-commands/general";
import { default_ } from "./new-commands/default";
import { get_userid, get_username } from "./new-commands/misc";

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
    interpolation: { escapeValue: false },
  });
  return i18n;
}

async function getDb() {
  const client = await MongoClient.connect(DB_CONN_STRING);
  const db = client.db(DB_NAME);
  return db;
}

const newCommands: NewCommand[] = [
  ["/start", start],
  ["/status", status],
  ["/set_role", set_role],
  ["/unset_role", unset_role],
  ["/get_role", get_role],
  ["/get_online_angels", get_online_angels],
  ["/show_debug", show_debug],
  ["/hide_debug", hide_debug],
  ["/get_userid", get_userid],
  ["/get_username", get_username],
  ["/set_angel_online", set_angel_online],
  ["/set_angel_offline", set_angel_offline],
  ["/reply_to", reply_to],
  ["/default", default_],
];

async function main() {
  const db = await getDb();
  const i18n = await getI18n();
  const stateful = new Stateful({ db, i18n });
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
  const router = new Router({ newCommands, bot, stateful });

  console.log("Listening for events...");

  bot.on("message", async (message) => {
    await router.handleMessage(message);
  });
}

main();
