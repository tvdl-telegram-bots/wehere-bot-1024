import { assert } from "console";
import { ChatResponse, Command, CommandContext } from "../../types";
import { expectInteger } from "../../utils/assert";
import { Stateful } from "../Stateful";

export class CommandGetLastMessages implements Command {
  stateful: Stateful;

  constructor({ stateful }: { stateful: Stateful }) {
    this.stateful = stateful;
  }

  match(args: string[]) {
    return args[0] === "/get_last_messages";
  }

  async handler({ args }: CommandContext): Promise<ChatResponse> {
    assert([1, 2].includes(args.length));
    const limit = args[1] ? expectInteger(args[1]) : 10;
    const messages = await this.stateful.getLastMessages({ limit });
    messages.sort((a, b) => a.timestamp - b.timestamp);
    return { type: "reply", payload: JSON.stringify(messages) };
  }
}
