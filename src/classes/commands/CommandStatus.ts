import { assert } from "console";
import { ChatResponse, Command, CommandContext } from "../../types";
import { Stateful } from "../Stateful";

export class CommandStatus implements Command {
  stateful: Stateful;

  constructor({ stateful }: { stateful: Stateful }) {
    this.stateful = stateful;
  }

  match(args: string[]) {
    return args[0] === "/status";
  }

  async handler({
    args,
    chatId,
    fromUserId,
  }: CommandContext): Promise<ChatResponse> {
    assert(args.length === 1);
    const role = await this.stateful.getRole({ userId: fromUserId, chatId });
    return {
      type: "reply",
      payload: `${JSON.stringify({ role })}`,
    };
  }
}
