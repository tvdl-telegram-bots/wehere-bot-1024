import * as Dotenv from "dotenv";
import { expectNonEmptyString } from "./utils/assert";

Dotenv.config();

export const TELEGRAM_BOT_TOKEN = expectNonEmptyString(
  process.env.TELEGRAM_BOT_TOKEN
);

export const DB_CONN_STRING = expectNonEmptyString(process.env.DB_CONN_STRING);
export const DB_NAME = expectNonEmptyString(process.env.DB_NAME);
