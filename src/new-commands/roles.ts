import { CommandHandler } from "../classes/Router";
import { UserError } from "../errors";

export const set_role: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  const newRole = args[1];
  UserError.assert(
    args.length === 2 && ["angel", "mortal"].includes(newRole),
    stateful.t("msg_invalid_syntax", { syntax: "/set_role <angel|mortal>" }),
    { args, fromUserId }
  );
  const update = { userId: fromUserId, key: "role", value: newRole };
  await stateful.setUserVariable(update);
  return {
    type: "reply",
    payload: stateful.t("msg_your_role_set_to", { role: newRole }),
    debugInfo: { update },
  };
};

export const get_role: CommandHandler = async (
  stateful,
  { args, fromUserId }
) => {
  UserError.assert(
    args.length === 1,
    stateful.t("msg_invalid_syntax", { syntax: "/get_role" })
  );
  const role = await stateful.getRole({ userId: fromUserId });
  return {
    type: "reply",
    payload: stateful.t("msg_your_role_is", { role }),
    debugInfo: { fromUserId, role },
  };
};

export const unset_role: CommandHandler = async (stateful, { fromUserId }) => {
  const filter = { userId: fromUserId, key: "role" };
  await stateful.unsetUserVariable(filter);
  return {
    type: "reply",
    payload: stateful.t("msg_your_role_reset"),
    debugInfo: { filter },
  };
};
