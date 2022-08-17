import { CommandHandler } from "../classes/Router";
import { getUserid, getUsername } from "../utils/usernames";
import { UserError } from "../errors";

export const get_userid: CommandHandler = async (stateful, { args }) => {
  const username = args[1];
  UserError.assert(
    args.length === 2 && username,
    stateful.t("msg_invalid_syntax", { syntax: "/get_userid <username>" })
  );

  const userid = getUserid(username);
  UserError.assert(userid, stateful.t("msg_cannot_get_userid"), { username });

  return {
    type: "reply",
    payload: stateful.t("msg_userid_of_username_is", { username, userid }),
  };
};

export const get_username: CommandHandler = async (stateful, { args }) => {
  const userid_ = args[1];
  UserError.assert(
    args.length === 2 && /^[0-9]+$/.test(userid_),
    stateful.t("msg_invalid_syntax", { syntax: "/get_username <userid>" })
  );

  const username = getUsername(parseInt(userid_, 10));
  UserError.assert(username, stateful.t("msg_cannot_get_username"), {
    username,
  });

  return {
    type: "reply",
    payload: stateful.t("msg_username_of_userid_is", {
      username,
      userid: userid_,
    }),
  };
};
