import { assert } from "console";
import { ChatResponse, Command, CommandContext } from "../../types";
import { expectNonEmptyString } from "../../utils/assert";
import { Stateful } from "../Stateful";

export class CommandGet implements Command {
  stateful: Stateful;

  constructor({ stateful }: { stateful: Stateful }) {
    this.stateful = stateful;
  }

  match(args: string[]) {
    return args[0] === "/get";
  }

  async handler({ args, chatId }: CommandContext): Promise<ChatResponse> {
    assert(args.length === 2);
    const key = expectNonEmptyString(args[1]);
    const found = await this.stateful.getChatVariable({ chatId, key });
    return { type: "reply", payload: JSON.stringify(found) };
  }
}
