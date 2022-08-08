import { assert } from "console";
import { ChatResponse, Command, CommandContext } from "../../types";
import { Stateful } from "../Stateful";

export class CommandGetOnlineAngels implements Command {
  stateful: Stateful;

  constructor({ stateful }: { stateful: Stateful }) {
    this.stateful = stateful;
  }

  match(args: string[]) {
    return args[0] === "/get_online_angels";
  }

  async handler({ args }: CommandContext): Promise<ChatResponse> {
    assert(args.length === 1);
    const angels = await this.stateful.getOnlineAngels();
    return {
      type: "reply",
      payload: `online angels: ${JSON.stringify(angels)}`,
    };
  }
}
