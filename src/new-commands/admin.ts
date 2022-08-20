import { TELEGRAM_BOT_TOKEN } from "../config";

import { CommandHandler } from "../classes/Router";
import { UserError } from "../errors";
import { getUserid } from "../utils/usernames";

export const drop_database: CommandHandler = async (stateful, { args }) => {
  const botToken = args[1];
  UserError.assert(args.length === 2 && botToken, "!invalid syntax");
  UserError.assert(botToken === TELEGRAM_BOT_TOKEN, "!invalid token");
  const succeeded = await stateful.dropDatabase();
  UserError.assert(succeeded, "!unable to drop db");
  return { type: "reply", payload: "!dropped database" };
};

export const add_angel: CommandHandler = async (stateful, { args }) => {
  const angelUsername = args[1];
  const botToken = args[2];
  UserError.assert(
    args.length === 3 && angelUsername && botToken,
    "!invalid syntax"
  );
  UserError.assert(botToken === TELEGRAM_BOT_TOKEN, "!invalid token");
  const angelUserId = getUserid(angelUsername);
  UserError.assert(angelUserId, "!cannot get userid");
  await stateful.addAngel({ userId: angelUserId });
  return { type: "reply", payload: "!added angel" };
};

export const remove_angel: CommandHandler = async (stateful, { args }) => {
  const angelUsername = args[1];
  const botToken = args[2];
  UserError.assert(
    args.length === 3 && angelUsername && botToken,
    "!invalid syntax"
  );
  UserError.assert(botToken === TELEGRAM_BOT_TOKEN, "!invalid token");
  const angelUserId = getUserid(angelUsername);
  UserError.assert(angelUserId, "!cannot get userid");
  await stateful.removeAngel({ userId: angelUserId });
  return { type: "reply", payload: "!removed angel" };
};

export const shutdown: CommandHandler = async (_stateful, { args }) => {
  const exitCode_ = args[1];
  const botToken = args[2];
  UserError.assert(
    args.length === 3 && /^[0-9]+$/.test(exitCode_) && botToken,
    "!invalid syntax"
  );
  UserError.assert(botToken === TELEGRAM_BOT_TOKEN, "!invalid token");
  const exitCode = parseInt(exitCode_, 10);
  process.exitCode = exitCode;
  throw new Error("!shutdown requested");
};
