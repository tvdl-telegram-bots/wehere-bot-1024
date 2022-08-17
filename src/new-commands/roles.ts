import { CommandHandler } from "../classes/Router";
import { UserError } from "../errors";

export const set_role: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  const newRole = args[1];
  if (args.length !== 2 || !["angel", "mortal"].includes(newRole)) {
    throw new UserError(
      "Oops! Invalid syntax.\nSyntax: /set_role <angel|mortal>"
    );
  }
  const update = { userId: fromUserId, key: "role", value: newRole };
  await stateful.setUserVariable(update);
  return {
    type: "reply",
    payload: `Success! Your role is set to ${newRole}.`,
    debugInfo: { update },
  };
};

export const get_role: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  if (args.length !== 1) {
    throw new UserError("Oops! Invalid syntax.\nSyntax: /get_role");
  }
  const role = await stateful.getRole({ userId: fromUserId });
  return {
    type: "reply",
    payload: `You are ${role}.`,
    debugInfo: { fromUserId, role },
  };
};

export const unset_role: CommandHandler = async (stateful, { fromUserId }) => {
  const filter = { userId: fromUserId, key: "role" };
  await stateful.unsetUserVariable(filter);
  return {
    type: "reply",
    payload: `Success! Your role is reset.`,
    debugInfo: { filter },
  };
};
