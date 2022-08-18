import { CommandHandler } from "../classes/Router";
import { UserError } from "../errors";

export const get_online_angels: CommandHandler = async (stateful, { args }) => {
  if (args.length !== 1) {
    throw new UserError("Opps! Invalid Syntax.\nSyntax: /get_online_angels");
  }
  const angels = await stateful.getOnlineAngels();
  return {
    type: "reply",
    payload:
      angels.length === 0
        ? "No online angels :("
        : `${angels.length} angels are online:\n\n` +
          angels.map((angel) => `${angel.userId}`).join("\n"),
    debugInfo: { angels },
  };
};

export const insert_angel: CommandHandler = () => {
  throw new Error("not implemented"); // TODO:
};

export const delete_angel: CommandHandler = () => {
  throw new Error("not implemented"); // TODO:
};
