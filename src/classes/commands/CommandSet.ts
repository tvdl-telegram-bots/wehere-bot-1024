import { ChatResponse, Command, CommandContext } from "../../types";
import { assert, expectNonEmptyString } from "../../utils/assert";
import { Stateful } from "../Stateful";

export class CommandSet implements Command {
  stateful: Stateful;

  constructor({ stateful }: { stateful: Stateful }) {
    this.stateful = stateful;
  }

  match(args: string[]) {
    return args[0] === "/set";
  }

  async handler({ args, chatId }: CommandContext): Promise<ChatResponse> {
    assert(args.length === 3);
    const key = expectNonEmptyString(args[1]);
    const value = expectNonEmptyString(args[2]);
    const update = { chatId, key, value };
    await this.stateful.setChatVariable(update);
    return { type: "reply", payload: `variable set ${JSON.stringify(update)}` };
  }
}
